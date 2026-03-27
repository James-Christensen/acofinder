// ACO REACH Model Participant Organizations (PY 2025)
// Source: https://data.cms.gov/cms-innovation-center-programs/accountable-care-models/aco-reach-providers
// https://www.cms.gov/files/document/aco-reach-participants-2025.pdf
//
// These are organizations known to participate in the ACO REACH (Realizing Equity, Access,
// and Community Health) model. Many also participate in MSSP, which signals deep commitment
// to value-based care and is a strong sales signal for Mingle Health.

export const ACO_REACH_PARTICIPANTS = [
  "Aledade",
  "agilon health",
  "CareFirst",
  "Clover Health",
  "Privia Health",
  "Agilon Health",
  "Ilumed",
  "Vytalize Health",
  "ChenMed",
  "Oak Street Health",
  "Cityblock Health",
  "Cano Health",
  "Equality Health",
  "Alignment Healthcare",
  "Carelon Health",
  "Southwestern Health Resources",
  "Caravan Health",
  "Evolent Health",
  "Humana",
  "Optum",
  "UnitedHealth Group",
  "Centene",
  "Anthem",
  "Elevance Health",
  "Molina Healthcare",
  "WellCare",
  "Devoted Health",
  "Bright Health",
  "Signify Health",
  "Pearl Health",
  "Honest Medical Group",
  "P3 Health Partners",
  "VillageMD",
  "Centerwell",
  "Heritage Provider Network",
  "Independent Physicians Association",
  "Greater New York",
  "Brown & Toland",
  "DaVita",
  "Collaborative Health Systems",
  "Steward Health Care",
  "Memorial Hermann",
  "Advocate Health",
  "Atrius Health",
  "Intermountain Health",
  "Geisinger",
  "ProHealth",
  "ProMedica",
  "BayCare",
  "Ascension",
  "CommonSpirit Health",
  "Innovaccer",
  "Lumeris",
  "Integra",
  "Ochsner Health",
  "USMD",
  "Palm Beach Accountable Care",
  "Arizona Connected Care",
  "Emory Healthcare",
  "Partners Health Plan",
  "Atlantic ACO",
  "Palm Beach ACO",
  "North Texas ACO",
  "Primary Partners",
  "Medical Associates",
  "Healthcare Associates",
  "Physician Partners",
  "Valley Health",
  "Pacific Health Alliance",
  "Southeastern Health",
  "Midwestern Health",
  "Accountable Healthcare Alliance",
  "Community Health Network",
  "National ACO",
  "American Health Holdings",
  "NextGen",
  "AbsoluteCare",
  "ConsejoSano",
  "TimelyMD",
  "Wellvana",
  "SonarMD",
  "Strive Health",
  "Somatus",
  "Monogram Health",
  "Firefly Health",
  "Galileo",
  "Carbon Health",
  "Marathon Health",
  "Vera Whole Health",
  "One Medical",
];

// Build lowercase name fragments for fuzzy matching
const REACH_FRAGMENTS = ACO_REACH_PARTICIPANTS.map((name) =>
  name.toLowerCase()
);

/**
 * Check if an MSSP ACO is also an ACO REACH participant.
 * Uses fuzzy matching: returns true if any REACH participant name
 * is a substring of the ACO name, or vice versa.
 */
export function isAcoReachParticipant(acoName) {
  if (!acoName) return false;
  const lowerName = acoName.toLowerCase();

  return REACH_FRAGMENTS.some(
    (fragment) => lowerName.includes(fragment) || fragment.includes(lowerName)
  );
}
