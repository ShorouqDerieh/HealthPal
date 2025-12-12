
module.exports = {
  donorDonationsQuerySchema: {
    fromDate: { type: "string", optional: true, max: 32 },
    toDate: { type: "string", optional: true, max: 32 },
    campaignId: { type: "number", integer: true, positive: true, optional: true },
    status: { type: "enum", optional: true, values: ["OPEN", "FUNDED", "CLOSED"] },
    limit: { type: "number", integer: true, positive: true, optional: true, convert: true},
    offset: { type: "number", integer: true, min: 0, optional: true ,convert: true},
  },

  ngoCampaignsQuerySchema: {
    org_id: { type: "number", integer: true, positive: true ,convert: true },
    status: { type: "enum", optional: true, values: ["OPEN", "FUNDED", "CLOSED"] },
    type: { type: "enum", optional: true, values: ["surgery", "dialysis", "cancer", "rehab", "other"] },
    limit: { type: "number", integer: true, positive: true, optional: true },
    offset: { type: "number", integer: true, min: 0, optional: true },
  },

  createDisbursementSchema: {
    org_id: { type: "number", integer: true, positive: true },
    campaign_id: { type: "number", integer: true, positive: true },
    to_org_id: { type: "number", integer: true, positive: true },
    amount: { type: "number", positive: true },
    currency: { type: "string", empty: false, max: 3 },
    disbursed_at: { type: "string", empty: false, max: 32 },
    note: { type: "string", optional: true, max: 512 },
  },

  createDocumentSchema: {
    org_id: { type: "number", integer: true, positive: true },
    campaign_id: { type: "number", integer: true, positive: true },
    type: { type: "enum", values: ["invoice", "receipt"] },
    file_id: { type: "number", integer: true, positive: true },
    issued_at: { type: "string", empty: false, max: 32 },
    amount: { type: "number", positive: true },
    currency: { type: "string", empty: false, max: 3 },
  },

  createPatientFeedbackSchema: {
    donation_id: { type: "number", integer: true, positive: true },
    rating: { type: "number", integer: true, min: 1, max: 5, optional: true },
    feedback_text: { type: "string", empty: false, max: 5000 },
    is_public: { type: "boolean" },
  },

  adminDonationsQuerySchema: {
    limit: { type: "number", integer: true, positive: true, optional: true,convert: true },
    offset: { type: "number", integer: true, min: 0, optional: true, convert: true },
  },

  flagCampaignSchema: {
    campaign_id: { type: "number", integer: true, positive: true,convert: true },
    reason: { type: "string", empty: false, max: 1000 },
  },
};
