const express = require('express');
const router = express.Router();
const controller = require('../controllers/missionApproveController.js');
router.post('/approve', controller.approve);
module.exports = router;
