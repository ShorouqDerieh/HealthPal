// services/anonChatMessageService.js
const MessageModel = require('../repositories/anonChatMessages.js');

async function sendMessage(chat_id, is_from_user, text) {
    if (!chat_id || is_from_user === undefined || text === undefined) {
        throw { status: 400, message: "Missing required fields" };
    }

    const chatExists = await MessageModel.chatExists(chat_id);
    if (!chatExists) {
        throw { status: 404, message: "Chat session not found" };
    }

    const message_id = await MessageModel.addMessage(
        chat_id,
        is_from_user,
        text
    );

    return message_id;
}

module.exports = {
    sendMessage
};
