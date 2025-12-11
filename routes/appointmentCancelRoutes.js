const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointmentCancelController.js');
router.post('/cancel', controller.cancel);
module.exports = router;
