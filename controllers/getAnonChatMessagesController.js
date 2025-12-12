const ChatModel = require('../repositories/anonChatMessages.js');

async function getMessages(req, res) {
    try {
        const { chat_id } = req.params;

        if (!chat_id) {
            return res.status(400).json({ error: "Missing chat_id" });
        }

        if (!await ChatModel.chatExists(chat_id)) {
            return res.status(404).json({ error: "Chat session not found" });
        }

        const messages = await ChatModel.getMessages(chat_id);

        return res.status(200).json({
            chat_id,
            count: messages.length,
            messages
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { getMessages };
