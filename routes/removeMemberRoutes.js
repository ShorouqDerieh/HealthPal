const express = require('express');
const router = express.Router();
const controller = require('../controllers/removeMemberController.js');
router.delete('/', controller.remove);
module.exports = router;
