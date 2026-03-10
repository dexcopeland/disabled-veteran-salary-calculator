// VA Disability Rates for 2026 (monthly)
// Source: VA Compensation Rates (effective December 1, 2025)
// https://www.va.gov/disability/compensation-rates/veteran-rates/

export interface VARateEntry {
  veteranAlone: number;
  withSpouse: number;
  withSpouseAndOneChild: number;
  withSpouseAndTwoChildren: number;
  withOneParent: number;
  withTwoParents: number;
  withOneChild: number;
  addPerChild: number;
}

export const vaRates: Record<number, VARateEntry> = {
  0: {
    veteranAlone: 0,
    withSpouse: 0,
    withSpouseAndOneChild: 0,
    withSpouseAndTwoChildren: 0,
    withOneParent: 0,
    withTwoParents: 0,
    withOneChild: 0,
    addPerChild: 0,
  },
  10: {
    veteranAlone: 180.42,
    withSpouse: 180.42,
    withSpouseAndOneChild: 180.42,
    withSpouseAndTwoChildren: 180.42,
    withOneParent: 180.42,
    withTwoParents: 180.42,
    withOneChild: 180.42,
    addPerChild: 0,
  },
  20: {
    veteranAlone: 356.66,
    withSpouse: 356.66,
    withSpouseAndOneChild: 356.66,
    withSpouseAndTwoChildren: 356.66,
    withOneParent: 356.66,
    withTwoParents: 356.66,
    withOneChild: 356.66,
    addPerChild: 0,
  },
  30: {
    veteranAlone: 552.47,
    withSpouse: 617.47,
    withSpouseAndOneChild: 666.47,
    withSpouseAndTwoChildren: 698.47,
    withOneParent: 604.47,
    withTwoParents: 656.47,
    withOneChild: 596.47,
    addPerChild: 32.0,
  },
  40: {
    veteranAlone: 795.84,
    withSpouse: 882.84,
    withSpouseAndOneChild: 947.84,
    withSpouseAndTwoChildren: 990.84,
    withOneParent: 865.84,
    withTwoParents: 935.84,
    withOneChild: 853.84,
    addPerChild: 43.0,
  },
  50: {
    veteranAlone: 1132.9,
    withSpouse: 1241.9,
    withSpouseAndOneChild: 1322.9,
    withSpouseAndTwoChildren: 1365.9,
    withOneParent: 1220.9,
    withTwoParents: 1308.9,
    withOneChild: 1205.9,
    addPerChild: 43.0,
  },
  60: {
    veteranAlone: 1435.02,
    withSpouse: 1566.02,
    withSpouseAndOneChild: 1663.02,
    withSpouseAndTwoChildren: 1706.02,
    withOneParent: 1540.02,
    withTwoParents: 1645.02,
    withOneChild: 1523.02,
    addPerChild: 43.0,
  },
  70: {
    veteranAlone: 1808.45,
    withSpouse: 1961.45,
    withSpouseAndOneChild: 2084.98,
    withSpouseAndTwoChildren: 2160.98,
    withOneParent: 1931.45,
    withTwoParents: 2054.45,
    withOneChild: 1931.45,
    addPerChild: 76.0,
  },
  80: {
    veteranAlone: 2102.15,
    withSpouse: 2277.15,
    withSpouseAndOneChild: 2406.43,
    withSpouseAndTwoChildren: 2482.43,
    withOneParent: 2242.15,
    withTwoParents: 2382.15,
    withOneChild: 2242.15,
    addPerChild: 76.0,
  },
  90: {
    veteranAlone: 2362.3,
    withSpouse: 2559.3,
    withSpouseAndOneChild: 2704.63,
    withSpouseAndTwoChildren: 2780.63,
    withOneParent: 2520.3,
    withTwoParents: 2678.3,
    withOneChild: 2520.3,
    addPerChild: 76.0,
  },
  100: {
    veteranAlone: 3938.58,
    withSpouse: 4158.17,
    withSpouseAndOneChild: 4318.99,
    withSpouseAndTwoChildren: 4428.1,
    withOneParent: 4114.82,
    withTwoParents: 4291.06,
    withOneChild: 4114.82,
    addPerChild: 109.11,
  },
};
