const router = require("express").Router();
const { authRequired, requireRole } = require("../../middleware/auth");
const { validate } = require("../../utils/fv");
const schemas = require("../../validators/transparencySchemas");
const ctrl = require("../../controllers/Feature 2.3/adminController");

router.get("/overview", authRequired, requireRole("admin"), ctrl.overview);

router.get(
  "/donations",
  authRequired,
  requireRole("admin"),
  validate({ schema: schemas.adminDonationsQuerySchema, source: "query" }),
  ctrl.listDonations
);

router.get("/audit/:donationId", authRequired, requireRole("admin"), ctrl.auditDonation);

router.post(
  "/flag-campaign",
  authRequired,
  requireRole("admin"),
  validate({ schema: schemas.flagCampaignSchema, source: "body" }),
  ctrl.flagCampaign
);

module.exports = router;
