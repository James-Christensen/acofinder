//Participating ACO Organizations  https://data.cms.gov/medicare-shared-savings-program/accountable-care-organizations

export let OrgUrl =
  "https://data.cms.gov/data-api/v1/dataset/69ec2609-5ce5-4ce1-b14c-1f8809fda2c2/data?column=aco_id,aco_name,aco_address,aco_public_reporting_website,aco_exec_name,aco_exec_email,aco_exec_phone,aco_public_name,aco_public_email,aco_public_phone,aco_compliance_contact_name,aco_medical_director_name,";
//2023 OrgURL =   "https://data.cms.gov/data-api/v1/dataset/ea96c3ef-0dcb-4549-9866-03f087e81a5d/data?column=aco_id,aco_name,aco_address,aco_public_reporting_website,aco_exec_name,aco_exec_email,aco_exec_phone,aco_public_name,aco_public_email,aco_public_phone,aco_compliance_contact_name,aco_medical_director_name,";

//ACO Performance & Quality Results: //https://data.cms.gov/medicare-shared-savings-program/performance-year-financial-and-quality-results

export let PerformanceUrl =
  "https://data.cms.gov/data-api/v1/dataset/73b2ce14-351d-40ac-90ba-ec9e1f5ba80c/data?column=ACO_ID,ACO_Name,ACO_State,Risk_Model,N_AB,Sav_Rate,MinSavPerc,BnchmkMinExp,GenSaveLoss,DisAdj,EarnSaveLoss,Report_WI,Report_eCQM,Report_CQM,Report_Inc,QualScore,MaxShareRate,FinalShareRate,N_PCP,N_Spec,QualityID_001_WI,QualityID_001_eCQM-CQM,QualityID_236_WI,QualityID_236_eCQM-CQM,QualityID_134_WI,QualityID_134_eCQM-CQM";
//2023 Performance URL=   "https://data.cms.gov/data-api/v1/dataset/bd6b766f-6fa3-43ae-8e9a-319da31dc374/data?column=ACO_ID,ACO_Name,ACO_State,Risk_Model,N_AB,Sav_Rate,MinSavPerc,BnchmkMinExp,GenSaveLoss,DisAdj,EarnSaveLoss,Report_WI,Report_eCQM,Report_CQM,Report_Inc,QualScore,MaxShareRate,FinalShareRate,N_PCP,N_Spec,QualityID_001_WI,QualityID_001_eCQM-CQM,QualityID_236_WI,QualityID_236_eCQM-CQM,QualityID_134_WI,QualityID_134_eCQM-CQM";

//ACO Participating Members: https://data.cms.gov/medicare-shared-savings-program/accountable-care-organization-participants

export const memberURL = `https://data.cms.gov/data-api/v1/dataset/9767cb68-8ea9-4f0b-8179-9431abc89f11/data?column=%22par_lbn%22%2C%22aco_id`;
//2023 memberURL = `https://data.cms.gov/data-api/v1/dataset/fd907586-71e8-4128-ad95-801ee1f4f6f0/data?column=%22par_lbn%22%2C%22aco_id`;

/////ID'S
//Data set IDs for list of all ACOs from CMS website.
const org24 = "69ec2609-5ce5-4ce1-b14c-1f8809fda2c2";
const org23 = "ea96c3ef-0dcb-4549-9866-03f087e81a5d";

//Performance Data Set IDs:
const perf24 = "73b2ce14-351d-40ac-90ba-ec9e1f5ba80c";
const perf23 = "bd6b766f-6fa3-43ae-8e9a-319da31dc374";

//Member Data Set IDs:
const mem24 = "9767cb68-8ea9-4f0b-8179-9431abc89f11";
const mem23 = "fd907586-71e8-4128-ad95-801ee1f4f6f0";
