import axios from "axios";

const NPPES_API = "https://npiregistry.cms.hhs.gov/api/?version=2.1";
const cache = {}; // In-memory cache keyed by practice name
const RATE_LIMIT_DELAY = 250; // ms between requests to respect rate limits

/**
 * Fetch NPI data for a single practice from the NPPES registry.
 * Results are cached in memory.
 */
export async function fetchNPIForPractice(practiceName) {
  if (!practiceName) return [];
  const cacheKey = practiceName.toLowerCase().trim();
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const res = await axios.get(NPPES_API, {
      params: {
        organization_name: practiceName,
        limit: 5,
        enumeration_type: "NPI-2",
      },
    });
    const results = res.data.results || [];
    cache[cacheKey] = results;
    return results;
  } catch (err) {
    console.warn(`NPPES lookup failed for "${practiceName}":`, err.message);
    cache[cacheKey] = [];
    return [];
  }
}

/**
 * Enrich an array of member practices with NPPES data.
 * Fetches sequentially with rate limiting to avoid API throttling.
 *
 * @param {Array} members - Array of { par_lbn, aco_id }
 * @param {Function} onProgress - Optional callback(completed, total)
 * @returns {Array} Enriched members with npiData field
 */
export async function enrichACOMembers(members, onProgress) {
  const enriched = [];
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const npiData = await fetchNPIForPractice(member.par_lbn);
    enriched.push({ ...member, npiData });
    if (onProgress) onProgress(i + 1, members.length);
    // Rate limiting between requests
    if (i < members.length - 1) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_DELAY));
    }
  }
  return enriched;
}

/**
 * Aggregate provider statistics from enriched member data.
 */
export function aggregateProviderStats(enrichedMembers) {
  const specialties = {};
  let totalNPIs = 0;
  const states = new Set();
  const cities = new Set();

  enrichedMembers.forEach((m) => {
    (m.npiData || []).forEach((npi) => {
      totalNPIs++;
      const taxonomy = npi.taxonomies?.[0]?.desc || "Unknown";
      specialties[taxonomy] = (specialties[taxonomy] || 0) + 1;

      const addr =
        npi.addresses?.find((a) => a.address_purpose === "LOCATION") ||
        npi.addresses?.[0];
      if (addr?.state) states.add(addr.state);
      if (addr?.city) cities.add(`${addr.city}, ${addr.state}`);
    });
  });

  return {
    totalNPIs,
    specialtyBreakdown: Object.entries(specialties)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15), // Top 15 specialties
    geographicSpread: [...states].sort(),
    cityCount: cities.size,
    practicesWithNPI: enrichedMembers.filter((m) => m.npiData?.length > 0)
      .length,
    practicesTotal: enrichedMembers.length,
  };
}
