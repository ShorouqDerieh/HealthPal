


const createTreatmentSchema ={
patient_user_id: {type:"number",integer:true,positive:true},
type:{
    type:"enum",values:["surgery", "dialysis", "cancer", "rehab", "other"],

},
description :{type:"string",empty:false,max:2000},
provider_org_id:{type:"number",integer:true,positive:true,optional:true}

};
const createCampaignSchema = {
  treatment_id: { type:"number",integer:true,positive:true},
  title: { type:"string",empty:false,max:255 },
  goal_amount: {type:"number",positive:true },
  currency: { type:"string",empty:false,max:3 },
  story: { type:"string",optional:true,max:5000 },
};

const donateSchema = {
  amount: { type: "number", positive: true },
  currency: { type: "string", empty: false, max: 3 },
  method: { type: "string", optional: true, max: 32 },
};

const listCampaignsQuerySchema = {
  type: {
    type: "enum",
    optional: true,
    values: ["surgery", "dialysis", "cancer", "rehab", "other"],
  },
  limit: { type: "number", integer: true, positive: true, optional: true },
  offset: { type: "number", integer: true, min: 0, optional: true },
};

module.exports = {
  createTreatmentSchema,
  createCampaignSchema,
  donateSchema,
  listCampaignsQuerySchema,
};