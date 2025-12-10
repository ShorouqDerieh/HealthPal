const db = require('../database');

async function chatExists(chat_id) {
    const sql = `SELECT id FROM anon_chats WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [chat_id]);
    return rows.length > 0;
}
async function addMessage(chat_id, is_from_user, text) {
    const sql = `
        INSERT INTO anon_chat_messages (chat_id, is_from_user, text, created_at)
        VALUES (?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [chat_id, is_from_user, text]);
    return result.insertId;
}
module.exports = {
    chatExists,
    addMessage
};
