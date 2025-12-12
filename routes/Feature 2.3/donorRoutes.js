const router = require("express").Router();
const { authRequired, requireRole } = require("../../middleware/auth");
const { validate } = require("../../utils/fv");
const schemas = require("../../validators/transparencySchemas");
const ctrl = require("../../controllers/Feature 2.3/donorController");

router.get("/summary", authRequired, requireRole("donor"), ctrl.summary);

router.get(
  "/donations",
  authRequired,
  requireRole("donor"),
  validate({ schema: schemas.donorDonationsQuerySchema, source: "query" }),
  ctrl.listDonations
);

router.get("/donations/:id", authRequired, requireRole("donor"), ctrl.donationDetails);

router.get("/feedback/:donationId", authRequired, requireRole("donor"), ctrl.publicFeedback);

module.exports = router;
