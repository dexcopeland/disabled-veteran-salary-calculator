import { taxRates, type FilingStatus, type TaxBracket } from "./tax-data";

export function calculateProgressiveTax(
  income: number,
  brackets: TaxBracket[]
): number {
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
 * State income tax using progressive brackets when available,
 * falling back to flat rate multiplication.
 */
export function calculateStateTax(
  grossSalary: number,
  stateCode: string,
  filingStatus: FilingStatus
): number {
  const stateInfo = taxRates[stateCode];
  if (!stateInfo) return 0;

  if (stateInfo.progressive && stateInfo.brackets) {
    const brackets =
      stateInfo.brackets[filingStatus] || stateInfo.brackets.single || null;

    if (brackets) {
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

  return grossSalary * stateInfo.state;
}

export function stateHasIncomeTax(stateCode: string): boolean {
  const info = taxRates[stateCode];
  if (!info) return false;
  return info.progressive || info.state > 0;
}
