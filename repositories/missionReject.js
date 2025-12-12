const db = require('../database');
async function registrationExists(registration_id) {
    const sql = `
        SELECT id, status
        FROM mission_registrations
        WHERE id = ?
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [registration_id]);
    return rows.length > 0 ? rows[0] : null;
}
async function reject(registration_id) {
    const sql = `
        UPDATE mission_registrations
        SET status = 'REJECTED'
        WHERE id = ?
    `;
    const [result] = await db.query(sql, [registration_id]);
    return result.affectedRows > 0;
}
module.exports = {
    registrationExists,
    reject
};
