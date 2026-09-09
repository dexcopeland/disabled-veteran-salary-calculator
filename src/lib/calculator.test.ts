import { describe, expect, it } from "vitest";
import {
  calculateRequiredSalary,
  calculateTakeHomeFromSalary,
  calculateVACompensation,
  defaultWithholdingSettings,
  validateInputs,
} from "./calculator";
import {
  getStateWithholdingProfile,
  getStateWithholdingTitle,
} from "./withholding";

const ROUND_TRIP_SALARY_TOLERANCE = 2;
const ROUND_TRIP_TAKEHOME_TOLERANCE = 1;

describe("calculateTakeHomeFromSalary", () => {
  it("estimates take-home from a known annual salary using the same tax engine", () => {
    const result = calculateTakeHomeFromSalary(
      80_000,
      0,
      "TX",
      "single",
      ""
    );

    expect(result.mode).toBe("knownSalary");
    expect(result.grossSalary).toBe(80_000);
    expect(result.federalTax).toBeGreaterThan(0);
    expect(result.stateTax).toBe(0);
    expect(result.ficaTax).toBeGreaterThan(0);
    expect(result.socialSecurityTax).toBeGreaterThan(0);
    expect(result.medicareTax).toBeGreaterThan(0);
    expect(result.ficaTax).toBeCloseTo(
      result.socialSecurityTax + result.medicareTax,
      5
    );
    expect(result.totalTaxes).toBeCloseTo(
      result.federalTax +
        result.stateTax +
        result.localTax +
        result.ficaTax,
      5
    );
    expect(result.netSalary).toBeCloseTo(80_000 - result.totalTaxes, 5);
    expect(result.totalAnnualTakeHome).toBeCloseTo(result.netSalary, 5);
    expect(result.totalMonthlyTakeHome).toBeCloseTo(
      result.totalAnnualTakeHome / 12,
      5
    );
  });

  it("adds tax-free VA compensation on top of after-tax salary", () => {
    const vaMonthly = calculateVACompensation(100, 0, false, false);
    const withoutVa = calculateTakeHomeFromSalary(
      80_000,
      0,
      "TX",
      "single",
      ""
    );
    const withVa = calculateTakeHomeFromSalary(
      80_000,
      vaMonthly,
      "TX",
      "single",
      ""
    );

    expect(vaMonthly).toBeGreaterThan(0);
    expect(withVa.vaCompensation).toBeCloseTo(vaMonthly * 12, 5);
    expect(withVa.federalTax).toBeCloseTo(withoutVa.federalTax, 5);
    expect(withVa.stateTax).toBeCloseTo(withoutVa.stateTax, 5);
    expect(withVa.totalAnnualTakeHome).toBeCloseTo(
      withoutVa.totalAnnualTakeHome + vaMonthly * 12,
      5
    );
  });

  it("charges progressive state tax in California and none in Texas", () => {
    const california = calculateTakeHomeFromSalary(
      90_000,
      0,
      "CA",
      "single",
      ""
    );
    const texas = calculateTakeHomeFromSalary(
      90_000,
      0,
      "TX",
      "single",
      ""
    );

    expect(california.stateTax).toBeGreaterThan(0);
    expect(california.hasStateIncomeTax).toBe(true);
    expect(texas.stateTax).toBe(0);
    expect(texas.hasStateIncomeTax).toBe(false);
    expect(california.federalTax).toBeCloseTo(texas.federalTax, 5);
    expect(california.totalAnnualTakeHome).toBeLessThan(
      texas.totalAnnualTakeHome
    );
  });

  it("applies local tax when a locality is selected", () => {
    const withoutLocal = calculateTakeHomeFromSalary(
      90_000,
      0,
      "NY",
      "single",
      ""
    );
    const withNyc = calculateTakeHomeFromSalary(
      90_000,
      0,
      "NY",
      "single",
      "New York City"
    );

    expect(withoutLocal.localTax).toBe(0);
    expect(withNyc.localTax).toBeGreaterThan(0);
    expect(withNyc.localTaxName).toBe("New York City");
    expect(withNyc.totalAnnualTakeHome).toBeLessThan(
      withoutLocal.totalAnnualTakeHome
    );
  });

  it("applies Additional Medicare Tax using the IRS threshold for each filing status", () => {
    const singleOver = calculateTakeHomeFromSalary(
      220_000,
      0,
      "TX",
      "single",
      ""
    );
    const marriedUnderJointThreshold = calculateTakeHomeFromSalary(
      220_000,
      0,
      "TX",
      "marriedJoint",
      ""
    );
    const marriedSeparateOver = calculateTakeHomeFromSalary(
      145_000,
      0,
      "TX",
      "marriedSeparate",
      ""
    );

    expect(singleOver.medicareTax).toBeCloseTo(
      220_000 * 0.0145 + 20_000 * 0.009,
      5
    );
    expect(marriedUnderJointThreshold.medicareTax).toBeCloseTo(
      220_000 * 0.0145,
      5
    );
    expect(marriedSeparateOver.medicareTax).toBeCloseTo(
      145_000 * 0.0145 + 20_000 * 0.009,
      5
    );
  });

  it("uses married-joint brackets for a lower federal bill than single at the same salary", () => {
    const single = calculateTakeHomeFromSalary(
      120_000,
      0,
      "FL",
      "single",
      ""
    );
    const married = calculateTakeHomeFromSalary(
      120_000,
      0,
      "FL",
      "marriedJoint",
      ""
    );

    expect(married.federalTax).toBeLessThan(single.federalTax);
    expect(married.totalAnnualTakeHome).toBeGreaterThan(
      single.totalAnnualTakeHome
    );
  });
});

describe("forward and reverse modes use the same tax engine", () => {
  const cases = [
    {
      name: "TX single 70% VA",
      salary: 85_000,
      rating: 70,
      dependents: 0,
      hasSpouse: false,
      state: "TX",
      filing: "single" as const,
      locality: "",
    },
    {
      name: "CA married-joint 100% VA with spouse",
      salary: 110_000,
      rating: 100,
      dependents: 1,
      hasSpouse: true,
      state: "CA",
      filing: "marriedJoint" as const,
      locality: "",
    },
    {
      name: "NYC single 50% VA",
      salary: 95_000,
      rating: 50,
      dependents: 0,
      hasSpouse: false,
      state: "NY",
      filing: "single" as const,
      locality: "New York City",
    },
    {
      name: "FL single 0% VA",
      salary: 60_000,
      rating: 0,
      dependents: 0,
      hasSpouse: false,
      state: "FL",
      filing: "single" as const,
      locality: "",
    },
  ];

  it.each(cases)(
    "round-trips salary ↔ take-home within tolerance: $name",
    ({ salary, rating, dependents, hasSpouse, state, filing, locality }) => {
      const vaMonthly = calculateVACompensation(
        rating,
        dependents,
        hasSpouse,
        false
      );
      const forward = calculateTakeHomeFromSalary(
        salary,
        vaMonthly,
        state,
        filing,
        locality
      );
      const reverse = calculateRequiredSalary(
        forward.totalAnnualTakeHome,
        vaMonthly,
        state,
        filing,
        locality
      );

      expect(reverse.mode).toBe("targetTakeHome");
      expect(reverse.grossSalary).toBeGreaterThanOrEqual(0);
      expect(Math.abs(reverse.grossSalary - salary)).toBeLessThanOrEqual(
        ROUND_TRIP_SALARY_TOLERANCE
      );
      expect(
        Math.abs(reverse.federalTax - forward.federalTax)
      ).toBeLessThanOrEqual(1);
      expect(Math.abs(reverse.stateTax - forward.stateTax)).toBeLessThanOrEqual(
        1
      );
      expect(Math.abs(reverse.ficaTax - forward.ficaTax)).toBeLessThanOrEqual(1);
      expect(
        Math.abs(reverse.totalAnnualTakeHome - forward.totalAnnualTakeHome)
      ).toBeLessThanOrEqual(ROUND_TRIP_TAKEHOME_TOLERANCE);
    }
  );

  it("lowers the required salary when VA compensation is higher", () => {
    const lowVa = calculateVACompensation(30, 0, false, false);
    const highVa = calculateVACompensation(100, 0, false, false);
    const target = 72_000;

    const withLowVa = calculateRequiredSalary(
      target,
      lowVa,
      "CA",
      "single",
      ""
    );
    const withHighVa = calculateRequiredSalary(
      target,
      highVa,
      "CA",
      "single",
      ""
    );

    expect(highVa).toBeGreaterThan(lowVa);
    expect(withHighVa.grossSalary).toBeLessThan(withLowVa.grossSalary);
  });
});

describe("validateInputs", () => {
  it("rejects a missing salary in known-salary mode", () => {
    expect(() => validateInputs(0, "TX", "knownSalary")).toThrow(
      /salary|offer/i
    );
  });

  it("rejects a missing take-home in target mode", () => {
    expect(() => validateInputs(0, "TX", "targetTakeHome")).toThrow(
      /take-home/i
    );
  });
});

describe("paycheck-style withholding settings", () => {
  const base = defaultWithholdingSettings("single");

  it("reduces federal withholding when Step 3 claim-dependents amount is entered", () => {
    const none = calculateTakeHomeFromSalary(
      80_000,
      0,
      "TX",
      "single",
      "",
      base
    );
    const withCredit = calculateTakeHomeFromSalary(
      80_000,
      0,
      "TX",
      "single",
      "",
      { ...base, dependentsCredit: 2_200 }
    );

    expect(withCredit.federalTax).toBeCloseTo(none.federalTax - 2_200, 5);
    expect(withCredit.totalAnnualTakeHome).toBeGreaterThan(
      none.totalAnnualTakeHome
    );
  });

  it("increases federal and state withheld amounts when additional withholding is entered", () => {
    const none = calculateTakeHomeFromSalary(
      80_000,
      0,
      "MD",
      "single",
      "",
      base
    );
    const extra = calculateTakeHomeFromSalary(
      80_000,
      0,
      "MD",
      "single",
      "",
      {
        ...base,
        additionalFederalAnnual: 1_200,
        additionalStateAnnual: 480,
      }
    );

    expect(extra.federalTax).toBeCloseTo(none.federalTax + 1_200, 5);
    expect(extra.stateTax).toBeCloseTo(none.stateTax + 480, 5);
    expect(extra.totalAnnualTakeHome).toBeCloseTo(
      none.totalAnnualTakeHome - 1_680,
      5
    );
  });

  it("lowers Maryland state withholding when MW507 exemptions are claimed", () => {
    const zeroExemptions = calculateTakeHomeFromSalary(
      80_000,
      0,
      "MD",
      "single",
      "",
      { ...base, stateExemptions: 0 }
    );
    const threeExemptions = calculateTakeHomeFromSalary(
      80_000,
      0,
      "MD",
      "single",
      "",
      { ...base, stateExemptions: 3 }
    );

    expect(getStateWithholdingProfile("MD")).toBe("exemptions");
    expect(threeExemptions.stateTax).toBeLessThan(zeroExemptions.stateTax);
    expect(threeExemptions.federalTax).toBeCloseTo(
      zeroExemptions.federalTax,
      5
    );
  });

  it("zeros and marks no-income-tax states so the state withholding section can hide", () => {
    const texas = calculateTakeHomeFromSalary(
      80_000,
      0,
      "TX",
      "single",
      "",
      {
        ...base,
        stateExemptions: 3,
        additionalStateAnnual: 1_000,
      }
    );

    expect(getStateWithholdingProfile("TX")).toBe("none");
    expect(getStateWithholdingTitle("TX")).toBe("Current Texas Withholding");
    expect(texas.hasStateIncomeTax).toBe(false);
    expect(texas.stateTax).toBe(0);
  });

  it("raises federal withholding when Step 2c (two jobs) is checked", () => {
    const oneJob = calculateTakeHomeFromSalary(
      80_000,
      0,
      "TX",
      "single",
      "",
      { ...base, twoJobs: false }
    );
    const twoJobs = calculateTakeHomeFromSalary(
      80_000,
      0,
      "TX",
      "single",
      "",
      { ...base, twoJobs: true }
    );

    expect(twoJobs.federalTax).toBeGreaterThan(oneJob.federalTax);
  });

  it("round-trips known salary with W-4 adjustments applied", () => {
    const settings = {
      ...base,
      dependentsCredit: 2_200,
      additionalFederalAnnual: 600,
      twoJobs: true,
    };
    const forward = calculateTakeHomeFromSalary(
      90_000,
      0,
      "FL",
      "single",
      "",
      settings
    );
    const reverse = calculateRequiredSalary(
      forward.totalAnnualTakeHome,
      0,
      "FL",
      "single",
      "",
      settings
    );

    expect(Math.abs(reverse.grossSalary - 90_000)).toBeLessThanOrEqual(2);
  });
});
