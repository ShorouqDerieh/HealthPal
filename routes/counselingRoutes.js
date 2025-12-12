
const express = require('express');
const router = express.Router();
const counselingController = require('../controllers/counselingController.js');
router.post('/', counselingController.create);

module.exports = router;
