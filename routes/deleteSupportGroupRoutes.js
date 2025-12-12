const express = require('express');
const router = express.Router();

const controller = require('../controllers/deleteSupportGroupController.js');

router.delete('/:id', controller.remove);

module.exports = router;
