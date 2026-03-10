// State tax rates, brackets, and local tax information
// Sources: Tax Foundation, state revenue department websites (2025 tax year)

export type FilingStatus = "single" | "marriedJoint" | "marriedSeparate" | "headOfHousehold";

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface StateTaxInfo {
  state: number;          // flat rate OR top marginal rate (used as fallback)
  county: number;         // default county rate
  city: number;           // default city rate
  progressive: boolean;   // whether state uses progressive brackets
  brackets?: {            // progressive brackets by filing status
    single?: TaxBracket[];
    marriedJoint?: TaxBracket[];
    marriedSeparate?: TaxBracket[];
    headOfHousehold?: TaxBracket[];
  };
  standardDeduction?: {   // state-level standard deduction
    single?: number;
    marriedJoint?: number;
    marriedSeparate?: number;
    headOfHousehold?: number;
  };
  hasLocalTax?: boolean;  // whether this state has city/county income taxes
}

// --- State Tax Rates ---
// Progressive states include bracket data; flat-tax states use the `state` field directly.

export const taxRates: Record<string, StateTaxInfo> = {
  // --- NO INCOME TAX ---
  AK: { state: 0, county: 0, city: 0, progressive: false },
  FL: { state: 0, county: 0, city: 0, progressive: false },
  NV: { state: 0, county: 0, city: 0, progressive: false },
  NH: { state: 0, county: 0, city: 0, progressive: false },
  SD: { state: 0, county: 0, city: 0, progressive: false },
  TN: { state: 0, county: 0, city: 0, progressive: false },
  TX: { state: 0, county: 0, city: 0, progressive: false },
  WA: { state: 0, county: 0, city: 0, progressive: false },
  WY: { state: 0, county: 0, city: 0, progressive: false },

  // --- FLAT TAX STATES ---
  AZ: { state: 0.025, county: 0, city: 0, progressive: false },
  CO: { state: 0.044, county: 0, city: 0, progressive: false },
  GA: { state: 0.0549, county: 0, city: 0, progressive: false },
  ID: { state: 0.058, county: 0, city: 0, progressive: false },
  IL: { state: 0.0495, county: 0, city: 0, progressive: false },
  IN: { state: 0.0305, county: 0, city: 0, progressive: false, hasLocalTax: true },
  KY: { state: 0.04, county: 0, city: 0, progressive: false },
  MA: { state: 0.05, county: 0, city: 0, progressive: false },
  MI: { state: 0.0425, county: 0, city: 0, progressive: false, hasLocalTax: true },
  MS: { state: 0.05, county: 0, city: 0, progressive: false },
  NC: { state: 0.045, county: 0, city: 0, progressive: false },
  ND: { state: 0.0195, county: 0, city: 0, progressive: false },
  PA: { state: 0.0307, county: 0, city: 0, progressive: false, hasLocalTax: true },
  UT: { state: 0.0465, county: 0, city: 0, progressive: false },

  // --- PROGRESSIVE TAX STATES ---
  AL: {
    state: 0.05, county: 0, city: 0, progressive: true, hasLocalTax: true,
    standardDeduction: { single: 2500, marriedJoint: 7500, marriedSeparate: 3750, headOfHousehold: 2500 },
    brackets: {
      single: [
        { min: 0, max: 500, rate: 0.02 },
        { min: 501, max: 3000, rate: 0.04 },
        { min: 3001, max: Infinity, rate: 0.05 },
      ],
    },
  },
  AR: {
    state: 0.039, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 2340, marriedJoint: 4680, marriedSeparate: 2340, headOfHousehold: 2340 },
    brackets: {
      single: [
        { min: 0, max: 4400, rate: 0.0 },
        { min: 4401, max: 8800, rate: 0.02 },
        { min: 8801, max: 87000, rate: 0.039 },
        { min: 87001, max: Infinity, rate: 0.044 },
      ],
    },
  },
  CA: {
    state: 0.093, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 5540, marriedJoint: 11080, marriedSeparate: 5540, headOfHousehold: 11080 },
    brackets: {
      single: [
        { min: 0, max: 10412, rate: 0.01 },
        { min: 10413, max: 24684, rate: 0.02 },
        { min: 24685, max: 38959, rate: 0.04 },
        { min: 38960, max: 54081, rate: 0.06 },
        { min: 54082, max: 68350, rate: 0.08 },
        { min: 68351, max: 349137, rate: 0.093 },
        { min: 349138, max: 418961, rate: 0.103 },
        { min: 418962, max: 698271, rate: 0.113 },
        { min: 698272, max: Infinity, rate: 0.123 },
      ],
      marriedJoint: [
        { min: 0, max: 20824, rate: 0.01 },
        { min: 20825, max: 49368, rate: 0.02 },
        { min: 49369, max: 77918, rate: 0.04 },
        { min: 77919, max: 108162, rate: 0.06 },
        { min: 108163, max: 136700, rate: 0.08 },
        { min: 136701, max: 698274, rate: 0.093 },
        { min: 698275, max: 837922, rate: 0.103 },
        { min: 837923, max: 1396542, rate: 0.113 },
        { min: 1396543, max: Infinity, rate: 0.123 },
      ],
    },
  },
  CT: {
    state: 0.0699, county: 0, city: 0, progressive: true,
    brackets: {
      single: [
        { min: 0, max: 10000, rate: 0.03 },
        { min: 10001, max: 50000, rate: 0.05 },
        { min: 50001, max: 100000, rate: 0.055 },
        { min: 100001, max: 200000, rate: 0.06 },
        { min: 200001, max: 250000, rate: 0.065 },
        { min: 250001, max: 500000, rate: 0.069 },
        { min: 500001, max: Infinity, rate: 0.0699 },
      ],
      marriedJoint: [
        { min: 0, max: 20000, rate: 0.03 },
        { min: 20001, max: 100000, rate: 0.05 },
        { min: 100001, max: 200000, rate: 0.055 },
        { min: 200001, max: 400000, rate: 0.06 },
        { min: 400001, max: 500000, rate: 0.065 },
        { min: 500001, max: 1000000, rate: 0.069 },
        { min: 1000001, max: Infinity, rate: 0.0699 },
      ],
    },
  },
  DE: {
    state: 0.066, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 3250, marriedJoint: 6500, marriedSeparate: 3250, headOfHousehold: 3250 },
    brackets: {
      single: [
        { min: 0, max: 2000, rate: 0.0 },
        { min: 2001, max: 5000, rate: 0.022 },
        { min: 5001, max: 10000, rate: 0.039 },
        { min: 10001, max: 20000, rate: 0.048 },
        { min: 20001, max: 25000, rate: 0.052 },
        { min: 25001, max: 60000, rate: 0.0555 },
        { min: 60001, max: Infinity, rate: 0.066 },
      ],
    },
  },
  HI: {
    state: 0.11, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 2200, marriedJoint: 4400, marriedSeparate: 2200, headOfHousehold: 3212 },
    brackets: {
      single: [
        { min: 0, max: 2400, rate: 0.014 },
        { min: 2401, max: 4800, rate: 0.032 },
        { min: 4801, max: 9600, rate: 0.055 },
        { min: 9601, max: 14400, rate: 0.064 },
        { min: 14401, max: 19200, rate: 0.068 },
        { min: 19201, max: 24000, rate: 0.072 },
        { min: 24001, max: 36000, rate: 0.076 },
        { min: 36001, max: 48000, rate: 0.079 },
        { min: 48001, max: 150000, rate: 0.0825 },
        { min: 150001, max: 175000, rate: 0.09 },
        { min: 175001, max: 200000, rate: 0.10 },
        { min: 200001, max: Infinity, rate: 0.11 },
      ],
    },
  },
  IA: {
    state: 0.06, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 2210, marriedJoint: 5450, marriedSeparate: 2725, headOfHousehold: 5450 },
    brackets: {
      single: [
        { min: 0, max: 6210, rate: 0.044 },
        { min: 6211, max: 31050, rate: 0.0482 },
        { min: 31051, max: Infinity, rate: 0.06 },
      ],
    },
  },
  KS: {
    state: 0.057, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 3500, marriedJoint: 8000, marriedSeparate: 4000, headOfHousehold: 6000 },
    brackets: {
      single: [
        { min: 0, max: 15000, rate: 0.031 },
        { min: 15001, max: 30000, rate: 0.0525 },
        { min: 30001, max: Infinity, rate: 0.057 },
      ],
      marriedJoint: [
        { min: 0, max: 30000, rate: 0.031 },
        { min: 30001, max: 60000, rate: 0.0525 },
        { min: 60001, max: Infinity, rate: 0.057 },
      ],
    },
  },
  LA: {
    state: 0.0425, county: 0, city: 0, progressive: true,
    brackets: {
      single: [
        { min: 0, max: 12500, rate: 0.0185 },
        { min: 12501, max: 50000, rate: 0.035 },
        { min: 50001, max: Infinity, rate: 0.0425 },
      ],
      marriedJoint: [
        { min: 0, max: 25000, rate: 0.0185 },
        { min: 25001, max: 100000, rate: 0.035 },
        { min: 100001, max: Infinity, rate: 0.0425 },
      ],
    },
  },
  ME: {
    state: 0.0715, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headOfHousehold: 21900 },
    brackets: {
      single: [
        { min: 0, max: 24500, rate: 0.058 },
        { min: 24501, max: 58050, rate: 0.0675 },
        { min: 58051, max: Infinity, rate: 0.0715 },
      ],
      marriedJoint: [
        { min: 0, max: 49050, rate: 0.058 },
        { min: 49051, max: 116100, rate: 0.0675 },
        { min: 116101, max: Infinity, rate: 0.0715 },
      ],
    },
  },
  MD: {
    state: 0.0575, county: 0, city: 0, progressive: true, hasLocalTax: true,
    standardDeduction: { single: 2550, marriedJoint: 5150, marriedSeparate: 2550, headOfHousehold: 5150 },
    brackets: {
      single: [
        { min: 0, max: 1000, rate: 0.02 },
        { min: 1001, max: 2000, rate: 0.03 },
        { min: 2001, max: 3000, rate: 0.04 },
        { min: 3001, max: 100000, rate: 0.0475 },
        { min: 100001, max: 125000, rate: 0.05 },
        { min: 125001, max: 150000, rate: 0.0525 },
        { min: 150001, max: 250000, rate: 0.055 },
        { min: 250001, max: Infinity, rate: 0.0575 },
      ],
      marriedJoint: [
        { min: 0, max: 1000, rate: 0.02 },
        { min: 1001, max: 2000, rate: 0.03 },
        { min: 2001, max: 3000, rate: 0.04 },
        { min: 3001, max: 150000, rate: 0.0475 },
        { min: 150001, max: 175000, rate: 0.05 },
        { min: 175001, max: 225000, rate: 0.0525 },
        { min: 225001, max: 300000, rate: 0.055 },
        { min: 300001, max: Infinity, rate: 0.0575 },
      ],
    },
  },
  MN: {
    state: 0.0985, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 14575, marriedJoint: 29150, marriedSeparate: 14575, headOfHousehold: 21850 },
    brackets: {
      single: [
        { min: 0, max: 31690, rate: 0.0535 },
        { min: 31691, max: 104090, rate: 0.068 },
        { min: 104091, max: 193240, rate: 0.0785 },
        { min: 193241, max: Infinity, rate: 0.0985 },
      ],
      marriedJoint: [
        { min: 0, max: 46330, rate: 0.0535 },
        { min: 46331, max: 184040, rate: 0.068 },
        { min: 184041, max: 321450, rate: 0.0785 },
        { min: 321451, max: Infinity, rate: 0.0985 },
      ],
    },
  },
  MO: {
    state: 0.048, county: 0, city: 0, progressive: true, hasLocalTax: true,
    standardDeduction: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headOfHousehold: 21900 },
    brackets: {
      single: [
        { min: 0, max: 1207, rate: 0.02 },
        { min: 1208, max: 2414, rate: 0.025 },
        { min: 2415, max: 3621, rate: 0.03 },
        { min: 3622, max: 4828, rate: 0.035 },
        { min: 4829, max: 6035, rate: 0.04 },
        { min: 6036, max: 7242, rate: 0.045 },
        { min: 7243, max: Infinity, rate: 0.048 },
      ],
    },
  },
  MT: {
    state: 0.059, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 5540, marriedJoint: 11080, marriedSeparate: 5540, headOfHousehold: 5540 },
    brackets: {
      single: [
        { min: 0, max: 20500, rate: 0.047 },
        { min: 20501, max: Infinity, rate: 0.059 },
      ],
    },
  },
  NE: {
    state: 0.0584, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 7900, marriedJoint: 15800, marriedSeparate: 7900, headOfHousehold: 11600 },
    brackets: {
      single: [
        { min: 0, max: 3700, rate: 0.0246 },
        { min: 3701, max: 22170, rate: 0.0351 },
        { min: 22171, max: 35730, rate: 0.0501 },
        { min: 35731, max: Infinity, rate: 0.0584 },
      ],
      marriedJoint: [
        { min: 0, max: 7390, rate: 0.0246 },
        { min: 7391, max: 44350, rate: 0.0351 },
        { min: 44351, max: 71460, rate: 0.0501 },
        { min: 71461, max: Infinity, rate: 0.0584 },
      ],
    },
  },
  NJ: {
    state: 0.1075, county: 0, city: 0, progressive: true,
    brackets: {
      single: [
        { min: 0, max: 20000, rate: 0.014 },
        { min: 20001, max: 35000, rate: 0.0175 },
        { min: 35001, max: 40000, rate: 0.035 },
        { min: 40001, max: 75000, rate: 0.05525 },
        { min: 75001, max: 500000, rate: 0.0637 },
        { min: 500001, max: 1000000, rate: 0.0897 },
        { min: 1000001, max: Infinity, rate: 0.1075 },
      ],
      marriedJoint: [
        { min: 0, max: 20000, rate: 0.014 },
        { min: 20001, max: 50000, rate: 0.0175 },
        { min: 50001, max: 70000, rate: 0.0245 },
        { min: 70001, max: 80000, rate: 0.035 },
        { min: 80001, max: 150000, rate: 0.05525 },
        { min: 150001, max: 500000, rate: 0.0637 },
        { min: 500001, max: 1000000, rate: 0.0897 },
        { min: 1000001, max: Infinity, rate: 0.1075 },
      ],
    },
  },
  NM: {
    state: 0.059, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headOfHousehold: 21900 },
    brackets: {
      single: [
        { min: 0, max: 5500, rate: 0.017 },
        { min: 5501, max: 11000, rate: 0.032 },
        { min: 11001, max: 16000, rate: 0.047 },
        { min: 16001, max: 210000, rate: 0.049 },
        { min: 210001, max: Infinity, rate: 0.059 },
      ],
      marriedJoint: [
        { min: 0, max: 8000, rate: 0.017 },
        { min: 8001, max: 16000, rate: 0.032 },
        { min: 16001, max: 24000, rate: 0.047 },
        { min: 24001, max: 315000, rate: 0.049 },
        { min: 315001, max: Infinity, rate: 0.059 },
      ],
    },
  },
  NY: {
    state: 0.109, county: 0, city: 0, progressive: true, hasLocalTax: true,
    standardDeduction: { single: 8000, marriedJoint: 16050, marriedSeparate: 8000, headOfHousehold: 11200 },
    brackets: {
      single: [
        { min: 0, max: 8500, rate: 0.04 },
        { min: 8501, max: 11700, rate: 0.045 },
        { min: 11701, max: 13900, rate: 0.0525 },
        { min: 13901, max: 80650, rate: 0.055 },
        { min: 80651, max: 215400, rate: 0.06 },
        { min: 215401, max: 1077550, rate: 0.0685 },
        { min: 1077551, max: 5000000, rate: 0.0965 },
        { min: 5000001, max: 25000000, rate: 0.103 },
        { min: 25000001, max: Infinity, rate: 0.109 },
      ],
      marriedJoint: [
        { min: 0, max: 17150, rate: 0.04 },
        { min: 17151, max: 23600, rate: 0.045 },
        { min: 23601, max: 27900, rate: 0.0525 },
        { min: 27901, max: 161550, rate: 0.055 },
        { min: 161551, max: 323200, rate: 0.06 },
        { min: 323201, max: 2155350, rate: 0.0685 },
        { min: 2155351, max: 5000000, rate: 0.0965 },
        { min: 5000001, max: 25000000, rate: 0.103 },
        { min: 25000001, max: Infinity, rate: 0.109 },
      ],
    },
  },
  OH: {
    state: 0.035, county: 0, city: 0, progressive: true, hasLocalTax: true,
    brackets: {
      single: [
        { min: 0, max: 26050, rate: 0.0 },
        { min: 26051, max: 100000, rate: 0.028 },
        { min: 100001, max: Infinity, rate: 0.035 },
      ],
    },
  },
  OK: {
    state: 0.0475, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 6350, marriedJoint: 12700, marriedSeparate: 6350, headOfHousehold: 9350 },
    brackets: {
      single: [
        { min: 0, max: 1000, rate: 0.0025 },
        { min: 1001, max: 2500, rate: 0.0075 },
        { min: 2501, max: 3750, rate: 0.0175 },
        { min: 3751, max: 4900, rate: 0.0275 },
        { min: 4901, max: 7200, rate: 0.0375 },
        { min: 7201, max: Infinity, rate: 0.0475 },
      ],
      marriedJoint: [
        { min: 0, max: 2000, rate: 0.0025 },
        { min: 2001, max: 5000, rate: 0.0075 },
        { min: 5001, max: 7500, rate: 0.0175 },
        { min: 7501, max: 9800, rate: 0.0275 },
        { min: 9801, max: 12200, rate: 0.0375 },
        { min: 12201, max: Infinity, rate: 0.0475 },
      ],
    },
  },
  OR: {
    state: 0.099, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 2745, marriedJoint: 5495, marriedSeparate: 2745, headOfHousehold: 4420 },
    brackets: {
      single: [
        { min: 0, max: 4050, rate: 0.0475 },
        { min: 4051, max: 10200, rate: 0.0675 },
        { min: 10201, max: 125000, rate: 0.0875 },
        { min: 125001, max: Infinity, rate: 0.099 },
      ],
      marriedJoint: [
        { min: 0, max: 8100, rate: 0.0475 },
        { min: 8101, max: 20400, rate: 0.0675 },
        { min: 20401, max: 250000, rate: 0.0875 },
        { min: 250001, max: Infinity, rate: 0.099 },
      ],
    },
  },
  RI: {
    state: 0.0599, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 10550, marriedJoint: 21150, marriedSeparate: 10550, headOfHousehold: 15825 },
    brackets: {
      single: [
        { min: 0, max: 73450, rate: 0.0375 },
        { min: 73451, max: 166950, rate: 0.0475 },
        { min: 166951, max: Infinity, rate: 0.0599 },
      ],
    },
  },
  SC: {
    state: 0.064, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headOfHousehold: 21900 },
    brackets: {
      single: [
        { min: 0, max: 3460, rate: 0.0 },
        { min: 3461, max: 17330, rate: 0.03 },
        { min: 17331, max: Infinity, rate: 0.064 },
      ],
    },
  },
  VA: {
    state: 0.0575, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 8000, marriedJoint: 16000, marriedSeparate: 8000, headOfHousehold: 8000 },
    brackets: {
      single: [
        { min: 0, max: 3000, rate: 0.02 },
        { min: 3001, max: 5000, rate: 0.03 },
        { min: 5001, max: 17000, rate: 0.05 },
        { min: 17001, max: Infinity, rate: 0.0575 },
      ],
    },
  },
  VT: {
    state: 0.0875, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headOfHousehold: 21900 },
    brackets: {
      single: [
        { min: 0, max: 45400, rate: 0.0335 },
        { min: 45401, max: 110050, rate: 0.066 },
        { min: 110051, max: 229550, rate: 0.076 },
        { min: 229551, max: Infinity, rate: 0.0875 },
      ],
      marriedJoint: [
        { min: 0, max: 75850, rate: 0.0335 },
        { min: 75851, max: 183400, rate: 0.066 },
        { min: 183401, max: 279450, rate: 0.076 },
        { min: 279451, max: Infinity, rate: 0.0875 },
      ],
    },
  },
  WV: {
    state: 0.0512, county: 0, city: 0, progressive: true,
    brackets: {
      single: [
        { min: 0, max: 10000, rate: 0.0236 },
        { min: 10001, max: 25000, rate: 0.0315 },
        { min: 25001, max: 40000, rate: 0.0354 },
        { min: 40001, max: 60000, rate: 0.0472 },
        { min: 60001, max: Infinity, rate: 0.0512 },
      ],
    },
  },
  WI: {
    state: 0.0765, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 13230, marriedJoint: 24480, marriedSeparate: 11830, headOfHousehold: 16030 },
    brackets: {
      single: [
        { min: 0, max: 14320, rate: 0.0354 },
        { min: 14321, max: 28640, rate: 0.0465 },
        { min: 28641, max: 315310, rate: 0.053 },
        { min: 315311, max: Infinity, rate: 0.0765 },
      ],
      marriedJoint: [
        { min: 0, max: 19090, rate: 0.0354 },
        { min: 19091, max: 38190, rate: 0.0465 },
        { min: 38191, max: 420420, rate: 0.053 },
        { min: 420421, max: Infinity, rate: 0.0765 },
      ],
    },
  },
  DC: {
    state: 0.1075, county: 0, city: 0, progressive: true,
    standardDeduction: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headOfHousehold: 21900 },
    brackets: {
      single: [
        { min: 0, max: 10000, rate: 0.04 },
        { min: 10001, max: 40000, rate: 0.06 },
        { min: 40001, max: 60000, rate: 0.065 },
        { min: 60001, max: 250000, rate: 0.085 },
        { min: 250001, max: 500000, rate: 0.0925 },
        { min: 500001, max: 1000000, rate: 0.0975 },
        { min: 1000001, max: Infinity, rate: 0.1075 },
      ],
    },
  },

  // --- TERRITORIES ---
  AS: { state: 0, county: 0, city: 0, progressive: false },
  GU: { state: 0, county: 0, city: 0, progressive: false },
  MP: { state: 0, county: 0, city: 0, progressive: false },
  PR: { state: 0, county: 0, city: 0, progressive: false },
  VI: { state: 0, county: 0, city: 0, progressive: false },
};

// --- Federal Tax Brackets for 2025 ---

export const federalTaxBrackets: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11601, max: 47150, rate: 0.12 },
    { min: 47151, max: 100525, rate: 0.22 },
    { min: 100526, max: 191950, rate: 0.24 },
    { min: 191951, max: 243725, rate: 0.32 },
    { min: 243726, max: 609350, rate: 0.35 },
    { min: 609351, max: Infinity, rate: 0.37 },
  ],
  marriedJoint: [
    { min: 0, max: 23200, rate: 0.1 },
    { min: 23201, max: 94300, rate: 0.12 },
    { min: 94301, max: 201050, rate: 0.22 },
    { min: 201051, max: 383900, rate: 0.24 },
    { min: 383901, max: 487450, rate: 0.32 },
    { min: 487451, max: 731200, rate: 0.35 },
    { min: 731201, max: Infinity, rate: 0.37 },
  ],
  marriedSeparate: [
    { min: 0, max: 11600, rate: 0.1 },
    { min: 11601, max: 47150, rate: 0.12 },
    { min: 47151, max: 100525, rate: 0.22 },
    { min: 100526, max: 191950, rate: 0.24 },
    { min: 191951, max: 243725, rate: 0.32 },
    { min: 243726, max: 365600, rate: 0.35 },
    { min: 365601, max: Infinity, rate: 0.37 },
  ],
  headOfHousehold: [
    { min: 0, max: 16550, rate: 0.1 },
    { min: 16551, max: 63100, rate: 0.12 },
    { min: 63101, max: 100500, rate: 0.22 },
    { min: 100501, max: 191950, rate: 0.24 },
    { min: 191951, max: 243700, rate: 0.32 },
    { min: 243701, max: 609350, rate: 0.35 },
    { min: 609351, max: Infinity, rate: 0.37 },
  ],
};

// Standard federal deduction for 2025
export const standardDeductions: Record<FilingStatus, number> = {
  single: 13850,
  marriedJoint: 27700,
  marriedSeparate: 13850,
  headOfHousehold: 20800,
};

// --- Local Tax Data ---
// Cities/counties with their own income taxes, grouped by state

export interface LocalTaxOption {
  name: string;
  rate: number;
  type: "city" | "county";
}

export const localTaxOptions: Record<string, LocalTaxOption[]> = {
  AL: [
    { name: "Birmingham", rate: 0.01, type: "city" },
    { name: "Gadsden", rate: 0.02, type: "city" },
    { name: "Macon County", rate: 0.01, type: "county" },
    { name: "Other / None", rate: 0, type: "city" },
  ],
  IN: [
    { name: "Adams County", rate: 0.0169, type: "county" },
    { name: "Allen County", rate: 0.0135, type: "county" },
    { name: "Hamilton County", rate: 0.01, type: "county" },
    { name: "Hendricks County", rate: 0.015, type: "county" },
    { name: "Johnson County", rate: 0.012, type: "county" },
    { name: "Lake County", rate: 0.0155, type: "county" },
    { name: "Marion County (Indianapolis)", rate: 0.0202, type: "county" },
    { name: "St. Joseph County", rate: 0.0175, type: "county" },
    { name: "Tippecanoe County", rate: 0.012, type: "county" },
    { name: "Vanderburgh County", rate: 0.0122, type: "county" },
    { name: "Other County (avg ~1.4%)", rate: 0.014, type: "county" },
  ],
  MD: [
    { name: "Allegany County", rate: 0.03, type: "county" },
    { name: "Anne Arundel County", rate: 0.027, type: "county" },
    { name: "Baltimore City", rate: 0.032, type: "county" },
    { name: "Baltimore County", rate: 0.032, type: "county" },
    { name: "Calvert County", rate: 0.03, type: "county" },
    { name: "Caroline County", rate: 0.0263, type: "county" },
    { name: "Carroll County", rate: 0.0305, type: "county" },
    { name: "Cecil County", rate: 0.028, type: "county" },
    { name: "Charles County", rate: 0.03, type: "county" },
    { name: "Dorchester County", rate: 0.0262, type: "county" },
    { name: "Frederick County", rate: 0.0296, type: "county" },
    { name: "Garrett County", rate: 0.0265, type: "county" },
    { name: "Harford County", rate: 0.0306, type: "county" },
    { name: "Howard County", rate: 0.032, type: "county" },
    { name: "Kent County", rate: 0.0285, type: "county" },
    { name: "Montgomery County", rate: 0.032, type: "county" },
    { name: "Prince George's County", rate: 0.032, type: "county" },
    { name: "Queen Anne's County", rate: 0.028, type: "county" },
    { name: "Somerset County", rate: 0.032, type: "county" },
    { name: "St. Mary's County", rate: 0.03, type: "county" },
    { name: "Talbot County", rate: 0.0225, type: "county" },
    { name: "Washington County", rate: 0.028, type: "county" },
    { name: "Wicomico County", rate: 0.032, type: "county" },
    { name: "Worcester County", rate: 0.0125, type: "county" },
  ],
  MI: [
    { name: "Detroit", rate: 0.024, type: "city" },
    { name: "Grand Rapids", rate: 0.015, type: "city" },
    { name: "Highland Park", rate: 0.02, type: "city" },
    { name: "Saginaw", rate: 0.015, type: "city" },
    { name: "Other / None", rate: 0, type: "city" },
  ],
  MO: [
    { name: "Kansas City", rate: 0.01, type: "city" },
    { name: "St. Louis", rate: 0.01, type: "city" },
    { name: "Other / None", rate: 0, type: "city" },
  ],
  NY: [
    { name: "New York City", rate: 0.03876, type: "city" },
    { name: "Yonkers", rate: 0.01695, type: "city" },
    { name: "Other / None", rate: 0, type: "city" },
  ],
  OH: [
    { name: "Akron", rate: 0.025, type: "city" },
    { name: "Canton", rate: 0.02, type: "city" },
    { name: "Cincinnati", rate: 0.0191, type: "city" },
    { name: "Cleveland", rate: 0.025, type: "city" },
    { name: "Columbus", rate: 0.025, type: "city" },
    { name: "Dayton", rate: 0.025, type: "city" },
    { name: "Toledo", rate: 0.025, type: "city" },
    { name: "Youngstown", rate: 0.0275, type: "city" },
    { name: "Other / None", rate: 0, type: "city" },
  ],
  PA: [
    { name: "Philadelphia", rate: 0.03398, type: "city" },
    { name: "Pittsburgh", rate: 0.03, type: "city" },
    { name: "Reading", rate: 0.032, type: "city" },
    { name: "Scranton", rate: 0.034, type: "city" },
    { name: "Other / None", rate: 0, type: "city" },
  ],
};

// --- State Names ---

export const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii",
  ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine",
  MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska",
  NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico",
  NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas",
  UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  AS: "American Samoa", GU: "Guam", MP: "Northern Mariana Islands",
  PR: "Puerto Rico", VI: "U.S. Virgin Islands",
};

export const stateOptions = Object.entries(stateNames)
  .map(([code, name]) => ({ value: code, label: name }))
  .sort((a, b) => a.label.localeCompare(b.label));
