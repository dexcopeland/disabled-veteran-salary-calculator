import { vaRates } from "./va-rates";
import {
  taxRates,
  federalTaxBrackets,
  standardDeductions,
  stateNames,
  localTaxOptions,
  type FilingStatus,
  type TaxBracket,
} from "./tax-data";

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

// --- Tax Calculations ---

function calculateProgressiveTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let remaining = income;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const taxableAmount = Math.min(remaining, bracket.max - bracket.min + 1);
    tax += taxableAmount * bracket.rate;
    remaining -= taxableAmount;
  }

  return tax;
}

/**
 * Calculate state income tax using progressive brackets when available,
 * falling back to flat rate multiplication.
 */
function calculateStateTax(
  grossSalary: number,
  stateCode: string,
  filingStatus: FilingStatus
): number {
  const stateInfo = taxRates[stateCode];
  if (!stateInfo) return 0;

  // If the state has progressive brackets, use them
  if (stateInfo.progressive && stateInfo.brackets) {
    // Determine which bracket set to use
    const brackets =
      stateInfo.brackets[filingStatus] ||
      stateInfo.brackets.single ||
      null;

    if (brackets) {
      // Apply state-level standard deduction if available
      let taxableIncome = grossSalary;
      if (stateInfo.standardDeduction) {
        const deduction =
          stateInfo.standardDeduction[filingStatus] ||
          stateInfo.standardDeduction.single ||
          0;
        taxableIncome = Math.max(0, grossSalary - deduction);
      }
      return calculateProgressiveTax(taxableIncome, brackets);
    }
  }

  // Flat-rate fallback
  return grossSalary * stateInfo.state;
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
  const info = taxRates[stateCode];
  return {
    location: stateNames[stateCode] || stateCode,
    hasStateIncomeTax: info.progressive || info.state > 0,
  };
}

function calculateTaxes(
  grossSalary: number,
  stateCode: string,
  filingStatus: FilingStatus,
  localityName: string
) {
  // FICA — Social Security + Medicare (employee share)
  const socialSecurityTax = Math.min(grossSalary, 168600) * 0.062;
  const baseMedicareTax = grossSalary * 0.0145;
  const additionalMedicareTax =
    filingStatus === "marriedJoint" && grossSalary > 250000
      ? (grossSalary - 250000) * 0.009
      : 0;
  const medicareTax = baseMedicareTax + additionalMedicareTax;
  const ficaTax = socialSecurityTax + medicareTax;

  // Federal tax
  const federalDeduction = standardDeductions[filingStatus] || 0;
  const federalTaxableIncome = Math.max(0, grossSalary - federalDeduction);
  const federalTax = calculateProgressiveTax(
    federalTaxableIncome,
    federalTaxBrackets[filingStatus]
  );

  // State tax (progressive or flat)
  const stateTax = calculateStateTax(grossSalary, stateCode, filingStatus);

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
  localityName: string
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
    const calc = calculateTaxes(mid, stateCode, filingStatus, localityName);
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
  localityName: string
): CalculationResult {
  const vaAnnualCompensation = vaMonthlyCompensation * 12;
  const taxes = calculateTaxes(
    annualGrossSalary,
    stateCode,
    filingStatus,
    localityName
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
