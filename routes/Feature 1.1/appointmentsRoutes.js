
const express = require("express");
const router = express.Router();

const { authRequired, requireRole } = require("../../middleware/auth");
const apptCtrl = require("../../controllers/Feature 1.1/appointmentsController");

router.post("/", authRequired, requireRole("patient"), apptCtrl.createAppointment);

router.patch("/:id/confirm", authRequired, requireRole("doctor"), apptCtrl.confirmAppointment);
router.patch("/:id/cancel", authRequired, apptCtrl.cancelAppointment);
router.get("/my", authRequired, apptCtrl.listMyAppointments);

router.get("/:id", authRequired, apptCtrl.getAppointment);

module.exports = router;
