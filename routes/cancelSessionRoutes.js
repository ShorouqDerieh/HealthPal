
const express = require('express');
const router = express.Router();
const cancelController = require('../controllers/cancelSessionController');

router.patch('/:id', cancelController.cancel);
module.exports = router;