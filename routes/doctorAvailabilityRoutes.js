const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorAvailabilityController.js');
router.post('/add', controller.add);
module.exports = router;
