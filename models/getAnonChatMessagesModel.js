const db = require('../database');

async function getMessages(chatId) {
    const sql = ` SELECT id, chat_id, is_from_user, text, created_at FROM anon_chat_messages WHERE chat_id = ? ORDER BY created_at ASC
    `;
    const [rows] = await db.query(sql, [chatId]);
    return rows;
}
async function chatExists(chatId) {
    const sql = `SELECT id FROM anon_chats WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [chatId]);
    return rows.length > 0;
}
module.exports = {
    getMessages,
    chatExists
};
