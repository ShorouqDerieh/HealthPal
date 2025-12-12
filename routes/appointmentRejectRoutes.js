const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointmentRejectController.js');
router.post('/reject', controller.reject);
module.exports = router;
