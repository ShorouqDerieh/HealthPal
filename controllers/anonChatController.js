const ChatService = require('../services/anonChatService.js');
async function start(req, res) {
    try {
        const { counselor_id } = req.body;

        if (!counselor_id) {
            return res.status(400).json({ error: "Missing counselor_id" });
        }

        const result = await ChatService.startAnonymousChat(counselor_id);
        return res.status(201).json({
            message: "Anonymous chat started",
            chat_id: result.chat_id,
            pseudonym: result.pseudonym
        });

    } catch (err) {
        if (err.message === "Counselor not found") {
            return res.status(404).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
}
module.exports = { start };

