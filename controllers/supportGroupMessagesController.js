const MessagesModel = require('../repositories/supportGroupMessagesModel.js');
const MembersModel = require('../repositories/supportGroupMembersModel.js');
const UserModel = require('../repositories/users.js');
async function send(req, res) {
    try {
        const { group_id, sender_user_id, message_text } = req.body;
        if (!group_id || !sender_user_id || !message_text) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!await UserModel.exists(sender_user_id)) {
            return res.status(404).json({ error: "User does not exist" });
        }
        if (!await MembersModel.isMember(group_id, sender_user_id)) {
            return res.status(403).json({ error: "User is not a member of this group" });
        }
        const result = await MessagesModel.sendMessage({
            group_id,
            sender_user_id,
            message_text
        });
        return res.status(201).json({
            message: "Message sent successfully",
            message_id: result.insertId
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = {
    send
};
