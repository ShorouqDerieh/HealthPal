

const createOrUpdateProfileSchema = {
  fullName: { type: "string", min: 3, max: 255 },
  dob: { type: "string", optional: true }, 
  gender: { type: "enum", values: ["M", "F", "X"], optional: true },
  bloodType: { type: "string", optional: true, max: 3 },
  primaryCondition: { type: "string", optional: true, max: 255 },
  country: { type: "string", optional: true, max: 128 },
  city: { type: "string", optional: true, max: 128 },
  caseSummary: { type: "string", optional: true },
  consentToDisplayCase: { type: "boolean", optional: true }
};

const addHistoryRecordSchema = {
  title: { type: "string", min: 3, max: 255 },
  description: { type: "string", min: 3 },
  recordDate: { type: "string" }, 
  hospitalName: { type: "string", optional: true, max: 255 },
  attendingPhysician: { type: "string", optional: true, max: 255 },
  isPublic: { type: "boolean", optional: true }
};

const createDonationGoalSchema = {
  title: { type: "string", min: 3, max: 255 },
  description: { type: "string", optional: true },
  targetAmount: { type: "number", positive: true },
  currency: { type: "string", min: 3, max: 3 },
  campaignId: { type: "number", integer: true, optional: true },
  startDate: { type: "string", optional: true },
  endDate: { type: "string", optional: true }
};

const updateDonationGoalSchema = {
  title: { type: "string", min: 3, max: 255, optional: true },
  description: { type: "string", optional: true },
  targetAmount: { type: "number", positive: true, optional: true },
  currency: { type: "string", min: 3, max: 3, optional: true },
  status: {
    type: "enum",
    values: ["ACTIVE", "COMPLETED", "CANCELLED"],
    optional: true
  },
  startDate: { type: "string", optional: true },
  endDate: { type: "string", optional: true }
};

const createRecoveryUpdateSchema = {
  title: { type: "string", min: 3, max: 255 },
  message: { type: "string", min: 3 },
  updateDate: { type: "string", optional: true },
  isPublic: { type: "boolean", optional: true }
};

module.exports = {
  createOrUpdateProfileSchema,
  addHistoryRecordSchema,
  createDonationGoalSchema,
  updateDonationGoalSchema,
  createRecoveryUpdateSchema
};
