const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointmentRequestController.js');
router.post('/request', controller.request);
module.exports = router;
