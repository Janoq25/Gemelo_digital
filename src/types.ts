export type MetricKey = 
  | 'compoundRisk'
  | 'tmaxAnomaly'
  | 'blackoutRate'
  | 'svi'
  | 'chronicPrevalence'
  | 'lackAc'
  | 'urbanHeatIsland';

export interface MetricDefinition {
  key: MetricKey;
  label: string;
  shortLabel: string;
  unit: string;
  description: string;
  source: string;
  min: number;
  max: number;
  format: (val: number) => string;
  colorScale: string[]; // tailwind or hex shades
}

export interface CountyZctaData {
  fips: string;
  name: string;
  zctaSample: string;
  population: number;
  svi: number; // 0-1
  chronicPrevalence: number; // %
  lackAc: number; // %
  urbanHeatIslandGini: number; // 0-1
  baselineHriRate: number; // per 100k
  simulatedRisk: number; // 0-100
  hhiRank: number; // CDC Measure 1504 percentile (0-100)
  calHeatScoreMatch?: number; // 0-4
  interventionFeasibilityEpsilon: number; // ε min needed for detectable risk drop (0.05 - 0.40)
}

export interface StateData {
  id: string; // 2-letter postal code
  fips: string;
  name: string;
  hhsRegion: number; // 1 to 10
  isEphtReporting2023: boolean; // 16 states confirmed in audit
  ephtRate440: number | null; // Age-adjusted ED rate per 100k (2023)
  vaSentinelRate1385: number; // Daily rate per 100k
  tmaxBaselineF: number;
  heatwaveP95F: number;
  blackoutRateBaseline: number; // % customers without power
  sviOverall: number; // 0 - 1
  sviTheme1_Socioeconomic: number;
  sviTheme2_Household: number;
  sviTheme3_RacialMinority: number;
  sviTheme4_HousingTransport: number;
  placesChronicPrevalence: number; // % (COPD, CVD, Diabetes composite)
  laceLackAcPercent: number; // % without AC
  landsatHeatIslandGini: number; // 0 - 1
  compositeRiskScore: number; // 0 - 100
  representativeCounties: CountyZctaData[];
}

export interface ScenarioParams {
  heatwaveDurationDays: 0 | 3 | 5 | 7;
  tempAnomalyF: number; // 0 to 15
  blackoutCustomerPercent: number; // 0 to 50%
  seasonTiming: 'early' | 'late'; // early = unacclimated population
  coolingInterventionEpsilon: number; // 0.00 to 0.40
}

export interface ShapFactor {
  feature: string;
  category: 'climate' | 'infrastructure' | 'social' | 'health';
  shapValue: number; // positive increases risk, negative decreases
  description: string;
}

export interface FairnessAuditMetrics {
  equalizedOddsDiff: number;
  equalizedOddsCi: [number, number];
  demographicParityRatio: number;
  demographicParityCi: [number, number];
  falseNegativeRateBySvi: {
    q1: number; // Lowest SVI (wealthiest)
    q2: number;
    q3: number;
    q4: number;
    q5: number; // Highest SVI (most vulnerable)
  };
  fnrDisparityRatio: number;
  tradeOffCurve: Array<{
    mitigationLevel: number;
    aucRoc: number;
    fnrDisparity: number;
  }>;
}

export interface ResearchHypothesis {
  id: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
  title: string;
  nullHypothesis: string;
  altHypothesis: string;
  testMethod: string;
  status: 'confirmed' | 'significant' | 'divergent';
  pValueOrCi: string;
  keyMetricName: string;
  keyMetricValue: string;
  interpretation: string;
}

export interface DigitalTwinLayerInfo {
  layer: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  name: string;
  purpose: string;
  defenseArgument: string;
  status: 'active' | 'synced' | 'calibrated';
  details: Record<string, string>;
}
