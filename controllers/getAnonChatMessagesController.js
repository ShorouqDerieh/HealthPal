// controllers/getAnonChatMessagesController.js
const GetAnonChatMessagesService = require('../services/getAnonChatMessagesService.js');
async function getMessages(req, res) {
    try {
        const { chat_id } = req.params;

        const messages = await GetAnonChatMessagesService.getMessages(chat_id);

        return res.status(200).json({
            chat_id,
            count: messages.length,
            messages
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { getMessages };
