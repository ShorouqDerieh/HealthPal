const express = require('express');
const router = express.Router();
const controller = require('../controllers/getMissionDetailsController.js');
router.get('/:mission_id', controller.getOne);
module.exports = router;
