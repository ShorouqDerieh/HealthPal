const express = require('express');
const router = express.Router();
const controller = require('../controllers/supportGroupsController.js');
router.post('/',controller.create);
module.exports = router;
