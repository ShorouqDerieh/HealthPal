const express = require('express');
const router = express.Router();
const controller = require('../controllers/getAnonChatMessagesController.js');

router.get('/:chat_id', controller.getMessages);

module.exports = router;
