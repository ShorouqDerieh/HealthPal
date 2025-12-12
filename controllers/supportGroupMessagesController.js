// controllers/supportGroupMessageController.js
const SupportGroupMessageService = require('../services/supportGroupMessageService.js');

async function send(req, res) {
    try {
        const { group_id, sender_user_id, message_text } = req.body;

        const messageId = await SupportGroupMessageService.send(
            group_id,
            sender_user_id,
            message_text
        );

        return res.status(201).json({
            message: "Message sent successfully",
            message_id: messageId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}

module.exports = {
    send
};
