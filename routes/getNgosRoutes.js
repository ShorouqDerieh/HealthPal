const express = require('express');
const router = express.Router();
const controller = require('../controllers/getNgosController.js');
router.get('/', controller.getAll);
module.exports = router;
