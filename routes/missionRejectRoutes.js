const express = require('express');
const router = express.Router();
const controller = require('../controllers/missionRejectController.js');
router.post('/reject', controller.reject);
module.exports = router;
