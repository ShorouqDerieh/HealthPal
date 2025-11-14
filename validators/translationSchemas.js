
const translateTextSchema = {
  text: { type: "string", empty: false, max: 4000 },
  source_lang: {
    type: "enum",
    values: ["auto", "ar", "en"],
    optional: true,
  },
  target_lang: {
    type: "enum",
    values: ["ar", "en"],
  },
  domain: {
    type: "string",
    optional: true,
    max: 50,
  },
};
const { validate } = require("../utils/fv");

module.exports = {
  translateTextSchema,
};
