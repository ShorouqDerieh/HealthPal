// services/getAnonChatMessagesService.js
const ChatModel = require('../repositories/getAnonChatMessages.js');
async function getMessages(chat_id) {

    if (!chat_id) {
        throw { status: 400, message: "Missing chat_id" };
    }

    if (!await ChatModel.chatExists(chat_id)) {
        throw { status: 404, message: "Chat session not found" };
    }
    const messages = await ChatModel.getMessages(chat_id);

    return messages;
}
module.exports = {
    getMessages
};
