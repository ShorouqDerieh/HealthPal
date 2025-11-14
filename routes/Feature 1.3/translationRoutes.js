// routes/Feature 1.1/translationRoutes.js
const express = require("express");
const router = express.Router();

const { authRequired } = require("../../middleware/auth");
const { validate } = require("../../utils/fv");
const { translateTextSchema } = require("../../validators/translationSchemas");

const translationCtrl = require("../../controllers/Feature 1.3/translationController");


router.post(
  "/preview",
  authRequired, 
  validate({ schema: translateTextSchema, source: "body" }),
  translationCtrl.previewTranslation
);

module.exports = router;
