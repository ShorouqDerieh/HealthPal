

const startSessionAudioSchema = {
  appointment_id: { type: "number", integer: true, positive: true },
};

const startSessionAsyncSchema = {
  appointment_id: { type: "number", integer: true, positive: true },
};

const updateBandwidthSchema = {
  mode: { type: "enum", values: ["full", "low", "async"] },
};

const postMessageSchema = {
  body: { type: "string", optional: true, empty: false, max: 8000 },
  file_id: { type: "number", integer: true, positive: true, optional: true },
  $$strict: "remove",
};

const listMessagesQuerySchema = {
  since: { type: "string", optional: true },
  page: { type: "number", integer: true, positive: true, optional: true, convert: true },
  pageSize: { type: "number", integer: true, positive: true, optional: true, convert: true },
};

const unreadMessagesQuerySchema = {
  since: { type: "string", empty: false },
};

const streamMessagesQuerySchema = {
  since: { type: "string", optional: true },
};

const fileUploadSchema = {
  storage_url: { type: "string", empty: false, max: 1024 },
  mime: { type: "string", optional: true, max: 128 },
  sha256: { type: "string", optional: true, max: 64 },
};

const typingStatusSchema = {
  is_typing: { type: "boolean" },
};

const translatedMessagesQuerySchema = {
  target_lang: {
    type: "enum",
    values: ["ar", "en"],
    optional: true,
  },
};

module.exports = {
  startSessionAudioSchema,
  startSessionAsyncSchema,
  updateBandwidthSchema,
  postMessageSchema,
  listMessagesQuerySchema,
  unreadMessagesQuerySchema,
  streamMessagesQuerySchema,
  fileUploadSchema,
  typingStatusSchema,
  translatedMessagesQuerySchema,
};
