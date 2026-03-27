import axios from "axios";

// CMS Provider Data API for hospital general information
const HOSPITAL_GENERAL_API =
  "https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u/0";

// Keywords that indicate a member practice might be a hospital
const HOSPITAL_KEYWORDS = [
  "hospital",
  "health system",
  "medical center",
  "health center",
  "clinic",
  "regional medical",
  "community health",
  "memorial",
];

/**
 * Search CMS hospital data by organization name.
 */
async function searchHospital(name) {
  try {
    const res = await axios.get(HOSPITAL_GENERAL_API, {
      params: {
        "filter[hospital_name]": name,
        limit: 5,
      },
    });
    return res.data?.results || [];
  } catch (err) {
    console.warn(`Hospital search failed for "${name}":`, err.message);
    return [];
  }
}

/**
 * Fetch hospital quality data for an ACO's member practices.
 * Only searches members whose names contain hospital-related keywords.
 *
 * @param {Array} members - Array of { par_lbn, aco_id }
 * @param {Function} onProgress - Optional callback(completed, total)
 * @returns {Array} Hospital records found
 */
export async function fetchHospitalsForACO(members, onProgress) {
  // Filter to members that look like hospitals
  const hospitalMembers = members.filter((m) =>
    HOSPITAL_KEYWORDS.some((kw) => m.par_lbn.toLowerCase().includes(kw))
  );

  // Limit to first 10 to avoid excessive API calls
  const toSearch = hospitalMembers.slice(0, 10);

  const allResults = [];
  const seen = new Set();

  for (let i = 0; i < toSearch.length; i++) {
    const member = toSearch[i];
    const results = await searchHospital(member.par_lbn);

    results.forEach((r) => {
      const id = r.facility_id || r.provider_id || r.hospital_name;
      if (!seen.has(id)) {
        seen.add(id);
        allResults.push(r);
      }
    });

    if (onProgress) onProgress(i + 1, toSearch.length);

    // Rate limiting
    if (i < toSearch.length - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return allResults;
}

/**
 * Parse hospital star rating from CMS data.
 */
export function parseStarRating(ratingStr) {
  if (!ratingStr || ratingStr === "Not Available") return null;
  const num = parseInt(ratingStr, 10);
  return isNaN(num) ? null : num;
}

/**
 * Determine readmission penalty status.
 */
export function getReadmissionStatus(hospital) {
  const readmission =
    hospital.readmission_national_comparison ||
    hospital.hospital_readmission_reduction;
  if (!readmission || readmission === "Not Available") {
    return { status: "unknown", label: "N/A", color: "opacity-50" };
  }
  if (
    readmission.toLowerCase().includes("worse") ||
    readmission.toLowerCase().includes("above")
  ) {
    return { status: "penalized", label: "Penalized", color: "text-error" };
  }
  if (
    readmission.toLowerCase().includes("better") ||
    readmission.toLowerCase().includes("below")
  ) {
    return {
      status: "good",
      label: "Below Average",
      color: "text-success",
    };
  }
  return { status: "average", label: "Average", color: "text-warning" };
}
