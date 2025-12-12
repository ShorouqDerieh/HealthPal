// controllers/anonChatMessageController.js
const MessageService = require('../services/anonChatMessageService.js');
async function send(req, res) {
    try {
        const { chat_id, is_from_user, text } = req.body;

        const message_id = await MessageService.sendMessage(
            chat_id,
            is_from_user,
            text
        );

        return res.status(201).json({
            message: "Message sent",
            message_id
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message || "Internal server error"
        });
    }
}
module.exports = {
    send
};
