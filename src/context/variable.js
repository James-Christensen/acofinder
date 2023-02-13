const org = {
  id: aco.aco_id,
  name: aco.aco_name,
  service: aco.aco_service_area,
};
const address = {
  street: aco.aco_address,
  streetTwo: aco.aco_address,
  city: aco.aco_address,
  state: aco.aco_address,
  zip: aco.aco_address,
};
const progInfo = {
  initialStart: aco.initial_start_date,
  currentStart: aco.current_start_date,
  agreementPeriod: aco.agreement_period_num,
  basicTrack: aco.basic_track,
  trackLevel: aco.basic_track_level,
  enhancedTrack: aco.enhanced_track,
  highRevenue: aco.high_revenue_aco,
  advPay: aco.adv_pay,
  aim: aco.aim,

  prospective: aco.prospective_assignment,
  retrospective: aco.retrospective_assignment,
  lat: aco.lat,
  long: aco.long,
};
const execCont = {
  name: aco.aco_exec_name,
  email: aco.aco_exec_email,
  phone: aco.aco_exec_phone,
};
const publicCont = {
  name: aco.aco_public_name,
  email: aco.aco_public_email,
  phone: aco.aco_public_phone,
};
const complianceCont = {
  name: aco.aco_compliance_contact_name,
};
const medDirector = {
  name: aco.aco_medical_director_name,
};
