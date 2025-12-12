const router = require("express").Router();
const { authRequired, requireRole } = require("../../middleware/auth");
const { validate } = require("../../utils/fv");
const schemas = require("../../validators/transparencySchemas");
const ctrl = require("../../controllers/Feature 2.3/ngoController");

router.get(
  "/campaigns",
  authRequired,
  requireRole("ngo_staff"),
  validate({ schema: schemas.ngoCampaignsQuerySchema, source: "query" }),
  ctrl.listCampaigns
);

router.get(
  "/campaigns/:campaignId",
  authRequired,
  requireRole("ngo_staff"),
  validate({ schema: schemas.ngoCampaignsQuerySchema, source: "query" }),
  ctrl.campaignDetails
);

router.post(
  "/disbursements",
  authRequired,
  requireRole("ngo_staff"),
  validate({ schema: schemas.createDisbursementSchema, source: "body" }),
  ctrl.createDisbursement
);

router.post(
  "/documents",
  authRequired,
  requireRole("ngo_staff"),
  validate({ schema: schemas.createDocumentSchema, source: "body" }),
  ctrl.createDocument
);

module.exports = router;
