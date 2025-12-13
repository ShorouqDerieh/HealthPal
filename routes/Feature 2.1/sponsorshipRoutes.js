const express =require("express");
const router =express.Router();
const {authRequired,requireRole}=require("../../middleware/auth");
const {validate}=require("../../utils/fv");
const {createTreatmentSchema,createCampaignSchema, donateSchema,listCampaignsQuerySchema} = require("../../validators/sponsorshipSchemas");

const sponsorshipCtrl = require("../../controllers/Feature 2.1/sponsorshipController");
router.post("/treatments",authRequired,requireRole("doctor"),validate({schema:createTreatmentSchema, source:"body"}),sponsorshipCtrl.createTreatment);
router.post("/campaigns",authRequired,requireRole("doctor"),validate({schema:createCampaignSchema,source:"body"}),sponsorshipCtrl.createCampaign);
router.get("/campaigns",validate({schema:listCampaignsQuerySchema,source:"query"}),sponsorshipCtrl.listCampaigns);
router.get("/campaigns/:id",sponsorshipCtrl.getCampaign);
router.post("/campaigns/:id/donate",authRequired,validate({schema:donateSchema,source:"body"}),sponsorshipCtrl.donate);
router.post(
  "/campaigns/:id/paypal/create",
  authRequired,
  sponsorshipCtrl.createPayPalOrder
);

router.post(
  "/campaigns/:id/paypal/capture",
  authRequired,
  sponsorshipCtrl.capturePayPalOrder
);

module.exports=router;