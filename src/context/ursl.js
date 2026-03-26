// CMS Medicare Shared Savings Program API Endpoints
// https://data.cms.gov/medicare-shared-savings-program

// Dataset IDs by year
export const DATASET_IDS = {
  org: {
    2024: "69ec2609-5ce5-4ce1-b14c-1f8809fda2c2",
    2023: "ea96c3ef-0dcb-4549-9866-03f087e81a5d",
  },
  performance: {
    2024: "73b2ce14-351d-40ac-90ba-ec9e1f5ba80c",
    2023: "bd6b766f-6fa3-43ae-8e9a-319da31dc374",
  },
  members: {
    2024: "9767cb68-8ea9-4f0b-8179-9431abc89f11",
    2023: "fd907586-71e8-4128-ad95-801ee1f4f6f0",
  },
};

export const CURRENT_YEAR = 2024;
export const PRIOR_YEAR = 2023;

const BASE_URL = "https://data.cms.gov/data-api/v1/dataset";

// Build a CMS data API URL
export function buildCmsUrl(datasetId, { columns, keyword, limit } = {}) {
  let url = `${BASE_URL}/${datasetId}/data`;
  const params = [];
  if (columns) params.push(`column=${columns}`);
  if (keyword) params.push(`keyword=${keyword}`);
  if (limit) params.push(`size=${limit}`);
  if (params.length > 0) url += `?${params.join("&")}`;
  return url;
}

// Organization data columns
const ORG_COLUMNS =
  "aco_id,aco_name,aco_address,aco_public_reporting_website,aco_exec_name,aco_exec_email,aco_exec_phone,aco_public_name,aco_public_email,aco_public_phone,aco_compliance_contact_name,aco_medical_director_name";

// Performance data columns
const PERF_COLUMNS =
  "ACO_ID,ACO_Name,ACO_State,Risk_Model,N_AB,Sav_Rate,MinSavPerc,BnchmkMinExp,GenSaveLoss,DisAdj,EarnSaveLoss,Report_WI,Report_eCQM,Report_CQM,Report_Inc,QualScore,MaxShareRate,FinalShareRate,N_PCP,N_Spec,QualityID_001_WI,QualityID_001_eCQM-CQM,QualityID_236_WI,QualityID_236_eCQM-CQM,QualityID_134_WI,QualityID_134_eCQM-CQM";

// Member data columns
const MEMBER_COLUMNS = "par_lbn,aco_id";

// Current year URLs
export const OrgUrl = buildCmsUrl(DATASET_IDS.org[CURRENT_YEAR], {
  columns: ORG_COLUMNS,
});

export const PerformanceUrl = buildCmsUrl(
  DATASET_IDS.performance[CURRENT_YEAR],
  { columns: PERF_COLUMNS }
);

export const memberURL = buildCmsUrl(DATASET_IDS.members[CURRENT_YEAR], {
  columns: MEMBER_COLUMNS,
});

// Prior year URLs (for year-over-year comparison)
export const PriorOrgUrl = buildCmsUrl(DATASET_IDS.org[PRIOR_YEAR], {
  columns: ORG_COLUMNS,
});

export const PriorPerformanceUrl = buildCmsUrl(
  DATASET_IDS.performance[PRIOR_YEAR],
  { columns: PERF_COLUMNS }
);

export const PriorMemberURL = buildCmsUrl(DATASET_IDS.members[PRIOR_YEAR], {
  columns: MEMBER_COLUMNS,
});

// Search URL builder
export function buildSearchUrl(keyword, year = CURRENT_YEAR) {
  return buildCmsUrl(DATASET_IDS.org[year], { columns: ORG_COLUMNS, keyword });
}
