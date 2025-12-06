const express = require('express');
const router = express.Router();

const controller = require('../controllers/updateSupportGroupController.js');

router.put('/:id', controller.update);

module.exports = router;
