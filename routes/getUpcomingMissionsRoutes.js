const express = require('express');
const router = express.Router();
const controller = require('../controllers/getUpcomingMissionsController.js');
router.get('/upcoming', controller.list);
module.exports = router;
