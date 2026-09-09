import { vaRates } from "./va-rates";
import {
  taxRates,
  stateNames,
  localTaxOptions,
  type FilingStatus,
} from "./tax-data";
import { stateHasIncomeTax } from "./tax-math";
import {
  calculateFederalWithholding,
  calculateStateWithholding,
  defaultWithholdingSettings,
  type WithholdingSettings,
} from "./withholding";

export type { WithholdingSettings } from "./withholding";
export { defaultWithholdingSettings } from "./withholding";

// --- Types ---

export type CalculationMode = "targetTakeHome" | "knownSalary";

export interface CalculationResult {
  mode: CalculationMode;
  grossSalary: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  ficaTax: number;
  totalTaxes: number;
  netSalary: number;
  vaCompensation: number;
  totalAnnualTakeHome: number;
  totalMonthlyTakeHome: number;
  location: string;
  localTaxName: string;
  hasStateIncomeTax: boolean;
}

// --- Rate Limiting ---

const RATE_LIMIT = {
  maxRequests: 100,
  timeWindow: 60000,
  requests: [] as number[],
};

export function checkRateLimit(): boolean {
  const now = Date.now();
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
    (time) => now - time < RATE_LIMIT.timeWindow
  );
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    throw new Error(
      "Too many calculations. Please wait a moment before trying again."
    );
  }
  RATE_LIMIT.requests.push(now);
  return true;
}

// --- Validation ---

function inputAmountError(
  mode: CalculationMode,
  kind: "empty" | "tooHigh"
): string {
  switch (mode) {
    case "knownSalary":
      return kind === "empty"
        ? "Please enter a valid salary or offer greater than $0"
        : "Salary seems unreasonably high. Please enter a realistic amount.";
    case "targetTakeHome":
      return kind === "empty"
        ? "Please enter a valid desired take-home pay greater than $0"
        : "Desired income seems unreasonably high. Please enter a realistic amount.";
    default: {
      const _exhaustive: never = mode;
      throw new Error(`Unhandled calculation mode: ${_exhaustive}`);
    }
  }
}

export function validateInputs(
  amount: number,
  stateCode: string,
  mode: CalculationMode = "targetTakeHome"
): void {
  if (isNaN(amount) || amount <= 0) {
    throw new Error(inputAmountError(mode, "empty"));
  }
  if (amount > 100000000) {
    throw new Error(inputAmountError(mode, "tooHigh"));
  }
  if (stateCode && !taxRates[stateCode]) {
    throw new Error("Please select a valid state or territory");
  }
}

// --- VA Compensation ---

export function calculateVACompensation(
  rating: number,
  dependents: number,
  hasSpouse: boolean,
  hasDependentParent: boolean
): number {
  const rate = vaRates[rating] || vaRates[0];
  let compensation = 0;

  if (hasSpouse && dependents === 0 && !hasDependentParent) {
    compensation = rate.withSpouse;
  } else if (hasSpouse && dependents === 1 && !hasDependentParent) {
    compensation = rate.withSpouseAndOneChild;
  } else if (hasSpouse && dependents === 2 && !hasDependentParent) {
    compensation = rate.withSpouseAndTwoChildren;
  } else if (hasSpouse && dependents > 2 && !hasDependentParent) {
    compensation =
      rate.withSpouseAndTwoChildren + rate.addPerChild * (dependents - 2);
  } else if (!hasSpouse && dependents === 1 && !hasDependentParent) {
    compensation = rate.withOneChild;
  } else if (!hasSpouse && dependents > 1 && !hasDependentParent) {
    compensation = rate.withOneChild + rate.addPerChild * (dependents - 1);
  } else if (!hasSpouse && dependents === 0 && hasDependentParent) {
    compensation = rate.withOneParent;
  } else if (hasSpouse && dependents > 0 && hasDependentParent) {
    if (dependents === 1) {
      compensation = rate.withSpouseAndOneChild;
    } else if (dependents === 2) {
      compensation = rate.withSpouseAndTwoChildren;
    } else {
      compensation =
        rate.withSpouseAndTwoChildren + rate.addPerChild * (dependents - 2);
    }
    const parentAddition = rate.withOneParent - rate.veteranAlone;
    compensation += parentAddition;
  } else {
    compensation = rate.veteranAlone;
  }

  return compensation;
}

/**
 * Get the local tax rate for a specific locality selection.
 * If no locality is selected, returns 0.
 */
function getLocalTaxRate(stateCode: string, localityName: string): number {
  if (!localityName || !stateCode) return 0;
  const options = localTaxOptions[stateCode];
  if (!options) return 0;
  const match = options.find((o) => o.name === localityName);
  return match ? match.rate : 0;
}

function getStateTaxInfo(stateCode: string) {
  if (!stateCode || !taxRates[stateCode]) {
    return {
      location: "No state selected",
      hasStateIncomeTax: false,
    };
  }
  return {
    location: stateNames[stateCode] || stateCode,
    hasStateIncomeTax: stateHasIncomeTax(stateCode),
  };
}

// Additional Medicare Tax (0.9%) wage thresholds — IRS Form 8959 / Pub. 15
// https://www.irs.gov/businesses/small-businesses-self-employed/questions-and-answers-for-the-additional-medicare-tax
function additionalMedicareWageThreshold(filingStatus: FilingStatus): number {
  switch (filingStatus) {
    case "marriedJoint":
      return 250000;
    case "marriedSeparate":
      return 125000;
    case "single":
    case "headOfHousehold":
      return 200000;
    default: {
      const _exhaustive: never = filingStatus;
      throw new Error(`Unhandled filing status: ${_exhaustive}`);
    }
  }
}

function calculateTaxes(
  grossSalary: number,
  stateCode: string,
  filingStatus: FilingStatus,
  localityName: string,
  withholding: WithholdingSettings = defaultWithholdingSettings(filingStatus)
) {
  // FICA — Social Security + Medicare (employee share)
  const socialSecurityTax = Math.min(grossSalary, 168600) * 0.062;
  const baseMedicareTax = grossSalary * 0.0145;
  const additionalMedicareThreshold =
    additionalMedicareWageThreshold(filingStatus);
  const additionalMedicareTax =
    grossSalary > additionalMedicareThreshold
      ? (grossSalary - additionalMedicareThreshold) * 0.009
      : 0;
  const medicareTax = baseMedicareTax + additionalMedicareTax;
  const ficaTax = socialSecurityTax + medicareTax;

  const settings: WithholdingSettings = {
    ...withholding,
    federalFilingStatus: withholding.federalFilingStatus || filingStatus,
    stateFilingStatus: withholding.stateFilingStatus || filingStatus,
  };

  const federalTax = calculateFederalWithholding(grossSalary, settings);
  const stateTax = calculateStateWithholding(grossSalary, stateCode, settings);

  // Local tax
  const localTaxRate = getLocalTaxRate(stateCode, localityName);
  const localTax = grossSalary * localTaxRate;

  const totalTaxes = federalTax + stateTax + localTax + ficaTax;
  const netSalary = grossSalary - totalTaxes;

  const info = getStateTaxInfo(stateCode);

  return {
    federalTax,
    stateTax,
    localTax,
    socialSecurityTax,
    medicareTax,
    ficaTax,
    totalTaxes,
    netSalary,
    location: info.location,
    localTaxName: localityName || "",
    hasStateIncomeTax: info.hasStateIncomeTax,
  };
}

function emptyTaxResult(stateCode: string, localityName: string) {
  const info = getStateTaxInfo(stateCode);
  return {
    federalTax: 0,
    stateTax: 0,
    localTax: 0,
    socialSecurityTax: 0,
    medicareTax: 0,
    ficaTax: 0,
    netSalary: 0,
    totalTaxes: 0,
    location: info.location,
    localTaxName: localityName || "",
    hasStateIncomeTax: info.hasStateIncomeTax,
  };
}

function withVaTotals(
  result: ReturnType<typeof calculateTaxes> & { grossSalary: number },
  vaAnnualCompensation: number,
  mode: CalculationMode
): CalculationResult {
  const totalAnnualTakeHome = result.netSalary + vaAnnualCompensation;
  return {
    ...result,
    mode,
    vaCompensation: vaAnnualCompensation,
    totalAnnualTakeHome,
    totalMonthlyTakeHome: totalAnnualTakeHome / 12,
  };
}

// --- Main Calculation ---

export function calculateRequiredSalary(
  desiredAnnualTakeHome: number,
  vaMonthlyCompensation: number,
  stateCode: string,
  filingStatus: FilingStatus,
  localityName: string,
  withholding: WithholdingSettings = defaultWithholdingSettings(filingStatus)
): CalculationResult {
  const vaAnnualCompensation = vaMonthlyCompensation * 12;
  const targetAfterTaxSalary = desiredAnnualTakeHome - vaAnnualCompensation;

  if (targetAfterTaxSalary <= 0) {
    return withVaTotals(
      { ...emptyTaxResult(stateCode, localityName), grossSalary: 0 },
      vaAnnualCompensation,
      "targetTakeHome"
    );
  }

  let low = 0;
  let high = desiredAnnualTakeHome * 2;
  let result = {
    ...emptyTaxResult(stateCode, localityName),
    grossSalary: 0,
  };

  for (let i = 0; i < 50; i++) {
    const mid = Math.floor((low + high) / 2);
    const calc = calculateTaxes(
      mid,
      stateCode,
      filingStatus,
      localityName,
      withholding
    );
    const currentNet = mid - calc.totalTaxes;
    const difference = currentNet - targetAfterTaxSalary;

    if (Math.abs(difference) < 1) {
      result = { ...calc, grossSalary: mid };
      break;
    } else if (currentNet < targetAfterTaxSalary) {
      low = mid;
    } else {
      high = mid;
    }

    if (high - low <= 1) {
      result = { ...calc, grossSalary: mid };
      break;
    }
  }

  return withVaTotals(result, vaAnnualCompensation, "targetTakeHome");
}

export function calculateTakeHomeFromSalary(
  annualGrossSalary: number,
  vaMonthlyCompensation: number,
  stateCode: string,
  filingStatus: FilingStatus,
  localityName: string,
  withholding: WithholdingSettings = defaultWithholdingSettings(filingStatus)
): CalculationResult {
  const vaAnnualCompensation = vaMonthlyCompensation * 12;
  const taxes = calculateTaxes(
    annualGrossSalary,
    stateCode,
    filingStatus,
    localityName,
    withholding
  );

  return withVaTotals(
    { ...taxes, grossSalary: annualGrossSalary },
    vaAnnualCompensation,
    "knownSalary"
  );
}

// --- Formatting ---

export function formatCurrency(amount: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}
