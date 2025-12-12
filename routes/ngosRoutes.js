const express = require('express');
const router = express.Router();
const controller = require('../controllers/ngosController.js');
router.post('/create', controller.create);
module.exports = router;
