const db = require('../database');
async function isMember(groupId, userId) {
    const sql = `SELECT user_id FROM support_group_members WHERE group_id = ? AND user_id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [groupId, userId]);
    return rows.length > 0;
}
async function sendMessage(data) {
    const sql = `INSERT INTO support_group_messages (group_id, sender_user_id, message_text) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [
        data.group_id,
        data.sender_user_id,
        data.message_text
    ]);
    return result;
}
module.exports = {
    isMember,
    sendMessage
};
