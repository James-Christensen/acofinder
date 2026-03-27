// Medicare Advantage Penetration Rates by State (2024)
// Source: CMS MA State/County Penetration Data
// https://www.cms.gov/data-research/statistics-trends-and-reports/medicare-advantagepart-d-contract-and-enrollment-data/ma-state/county-penetration

export const MA_PENETRATION = {
  AL: 50.0,
  AK: 7.0,
  AZ: 47.0,
  AR: 33.0,
  CA: 47.0,
  CO: 46.0,
  CT: 41.0,
  DE: 27.0,
  DC: 16.0,
  FL: 55.0,
  GA: 42.0,
  HI: 59.0,
  ID: 35.0,
  IL: 36.0,
  IN: 38.0,
  IA: 27.0,
  KS: 25.0,
  KY: 37.0,
  LA: 44.0,
  ME: 30.0,
  MD: 26.0,
  MA: 33.0,
  MI: 43.0,
  MN: 50.0,
  MS: 29.0,
  MO: 39.0,
  MT: 22.0,
  NE: 26.0,
  NV: 49.0,
  NH: 24.0,
  NJ: 37.0,
  NM: 36.0,
  NY: 45.0,
  NC: 39.0,
  ND: 14.0,
  OH: 46.0,
  OK: 35.0,
  OR: 50.0,
  PA: 49.0,
  PR: 76.0,
  RI: 47.0,
  SC: 37.0,
  SD: 16.0,
  TN: 42.0,
  TX: 47.0,
  UT: 40.0,
  VT: 11.0,
  VA: 32.0,
  WA: 40.0,
  WV: 33.0,
  WI: 42.0,
  WY: 7.0,
};

export function getMAPenetration(stateCode) {
  if (!stateCode) return null;
  return MA_PENETRATION[stateCode.toUpperCase()] || null;
}

export function getMAPressureLevel(penetration) {
  if (penetration === null || penetration === undefined) {
    return { level: "unknown", label: "N/A", color: "opacity-50" };
  }
  if (penetration >= 50) {
    return { level: "high", label: "High MA Pressure", color: "text-error" };
  }
  if (penetration >= 35) {
    return { level: "medium", label: "Moderate MA Pressure", color: "text-warning" };
  }
  return { level: "low", label: "Low MA Pressure", color: "text-success" };
}
