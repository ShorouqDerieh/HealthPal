const express = require('express');
const router = express.Router();

const controller = require('../controllers/getPatientSessionsController.js');

router.get('/:id', controller.getByPatient);

module.exports = router;
