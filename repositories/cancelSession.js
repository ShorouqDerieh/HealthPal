
const db = require('../database');

async function findSessionById(sessionId) {
    const sql = 'SELECT * FROM counseling_sessions WHERE id = ?';
    const [rows] = await db.query(sql, [sessionId]);
    return rows;
}

async function cancel(sessionId) {
    const sql = `
        UPDATE counseling_sessions
        SET status = 'CANCELLED'
        WHERE id = ?
    `;
    const [result] = await db.query(sql, [sessionId]);
    return result;
}

module.exports = {
    findSessionById,
    cancel
};
