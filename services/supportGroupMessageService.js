// services/supportGroupMessageService.js
const MessagesModel = require('../repositories/supportGroupMessagesModel.js');
const MembersModel = require('../repositories/supportGroupMembersModel.js');
const UserModel = require('../repositories/users.js');

async function send(group_id, sender_user_id, message_text) {

    if (!group_id || !sender_user_id || !message_text) {
        throw { status: 400, message: "Missing required fields" };
    }

    if (!await UserModel.exists(sender_user_id)) {
        throw { status: 404, message: "User does not exist" };
    }

    if (!await MembersModel.isMember(group_id, sender_user_id)) {
        throw { status: 403, message: "User is not a member of this group" };
    }

    const result = await MessagesModel.sendMessage({
        group_id,
        sender_user_id,
        message_text
    });

    return result.insertId;
}

module.exports = {
    send
};
