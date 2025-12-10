const MessageModel = require('../repositories/anonChatMessagesModel.js');

async function send(req, res) {
    try {
        const { chat_id, is_from_user, text } = req.body;

        if (!chat_id || is_from_user === undefined || text === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!await MessageModel.chatExists(chat_id)) {
            return res.status(404).json({ error: "Chat session not found" });
        }

        const message_id = await MessageModel.addMessage(chat_id, is_from_user, text);

        return res.status(201).json({
            message: "Message sent",
            message_id
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = {
    send
};
