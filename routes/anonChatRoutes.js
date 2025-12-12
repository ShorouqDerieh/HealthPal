const express = require('express');
const router = express.Router();
const controller = require('../controllers/anonChatController.js');
router.post('/start', controller.start);
console.log("controller is:", controller);
module.exports = router;
