import {
  federalTaxBrackets,
  standardDeductions,
  stateNames,
  type FilingStatus,
} from "./tax-data";
import {
  calculateProgressiveTax,
  calculateStateTax,
  stateHasIncomeTax,
} from "./tax-math";

export type StateWithholdingProfile = "none" | "exemptions" | "additional";

export interface WithholdingSettings {
  federalFilingStatus: FilingStatus;
  twoJobs: boolean;
  dependentsCredit: number;
  otherIncome: number;
  deductions: number;
  additionalFederalAnnual: number;
  stateFilingStatus: FilingStatus;
  stateExemptions: number;
  additionalStateAnnual: number;
}

export function defaultWithholdingSettings(
  filingStatus: FilingStatus = "single"
): WithholdingSettings {
  return {
    federalFilingStatus: filingStatus,
    twoJobs: false,
    dependentsCredit: 0,
    otherIncome: 0,
    deductions: 0,
    additionalFederalAnnual: 0,
    stateFilingStatus: filingStatus,
    stateExemptions: 0,
    additionalStateAnnual: 0,
  };
}

/**
 * Maryland employer withholding treats each MW507 exemption as $3,200.
 * Source: Comptroller of Maryland, Withholding Tax Facts (Jan–Dec 2026)
 * https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/legal-publications/facts/withholding-tax-facts-2026.pdf
 */
export const MARYLAND_EXEMPTION_AMOUNT = 3200;

export function getStateWithholdingProfile(
  stateCode: string
): StateWithholdingProfile {
  if (!stateCode || !stateHasIncomeTax(stateCode)) return "none";
  if (stateCode === "MD") return "exemptions";
  return "additional";
}

export function getStateWithholdingTitle(stateCode: string): string {
  if (!stateCode) return "Current State Withholding";
  const name = stateNames[stateCode] || stateCode;
  return `Current ${name} Withholding`;
}

/**
 * Annual federal income-tax withholding (Pub 15-T percentage method, simplified).
 * Uses this app's existing federal brackets / standard deductions.
 * Step 2c uses half the standard deduction (the Step 2 checkbox column).
 * Step 3 is subtracted as a credit. Step 4c is added as extra annual withholding.
 * https://www.irs.gov/pub/irs-pdf/p15t.pdf
 */
export function calculateFederalWithholding(
  annualWages: number,
  settings: WithholdingSettings
): number {
  const standard = standardDeductions[settings.federalFilingStatus] || 0;
  const withholdingStandard = settings.twoJobs ? standard / 2 : standard;
  const adjustedWages = Math.max(
    0,
    annualWages +
      Math.max(0, settings.otherIncome) -
      Math.max(0, settings.deductions) -
      withholdingStandard
  );
  const tentative = calculateProgressiveTax(
    adjustedWages,
    federalTaxBrackets[settings.federalFilingStatus]
  );
  const afterDependentCredit = Math.max(
    0,
    tentative - Math.max(0, settings.dependentsCredit)
  );
  return afterDependentCredit + Math.max(0, settings.additionalFederalAnnual);
}

export function calculateStateWithholding(
  annualWages: number,
  stateCode: string,
  settings: WithholdingSettings
): number {
  const profile = getStateWithholdingProfile(stateCode);
  switch (profile) {
    case "none":
      return 0;
    case "exemptions": {
      const exemptionWages = Math.max(
        0,
        annualWages -
          Math.max(0, settings.stateExemptions) * MARYLAND_EXEMPTION_AMOUNT
      );
      const tax = calculateStateTax(
        exemptionWages,
        stateCode,
        settings.stateFilingStatus
      );
      return Math.max(0, tax + Math.max(0, settings.additionalStateAnnual));
    }
    case "additional": {
      const tax = calculateStateTax(
        annualWages,
        stateCode,
        settings.stateFilingStatus
      );
      return Math.max(0, tax + Math.max(0, settings.additionalStateAnnual));
    }
    default: {
      const _exhaustive: never = profile;
      throw new Error(`Unhandled state withholding profile: ${_exhaustive}`);
    }
  }
}
