const express = require('express');
const router = express.Router();
const controller = require('../controllers/getDoctorAppointmentsController.js');
router.get('/:doctor_user_id', controller.getAll);
module.exports = router;
