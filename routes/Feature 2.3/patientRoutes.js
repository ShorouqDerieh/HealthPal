const router = require("express").Router();
const { authRequired, requireRole } = require("../../middleware/auth");
const { validate } = require("../../utils/fv");
const schemas = require("../../validators/transparencySchemas");
const ctrl = require("../../controllers/Feature 2.3/patientController");

router.post(
  "/feedback",
  authRequired,
  requireRole("patient"),
  validate({ schema: schemas.createPatientFeedbackSchema, source: "body" }),
  ctrl.createFeedback
);

router.get("/feedback/my", authRequired, requireRole("patient"), ctrl.myFeedback);

module.exports = router;
