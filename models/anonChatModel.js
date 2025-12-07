const db = require('../database');
async function createSession(counselor_id, pseudonym) {
    const sql = `INSERT INTO anon_chats (counselor_user_id, pseudonym, started_at) VALUES (?, ?, NOW()) `;
    const [result] = await db.query(sql, [counselor_id, pseudonym]);
    return result.insertId;
}
module.exports = {
    createSession
};
