const express = require('express');
const router = express.Router();
const controller = require('../controllers/anonChatMessagesController.js');

// Send message API
router.post('/send', controller.send);

module.exports = router;
