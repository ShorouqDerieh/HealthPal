const express = require('express');
const router = express.Router();
const controller = require('../controllers/getPatientAppointmentsController.js');
router.get('/:patient_user_id', controller.getAll);
module.exports = router;
