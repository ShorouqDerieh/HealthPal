const express = require('express');
const router = express.Router();
const controller = require('../controllers/joinRequestController.js');

router.post('/', controller.requestJoin);

module.exports = router;
