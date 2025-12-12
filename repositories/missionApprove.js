const db = require('../database');
async function registrationExists(registration_id) {
    const sql = `
        SELECT mr.id, mr.status, sm.max_patients, 
               (SELECT COUNT(*) FROM mission_registrations WHERE mission_id = mr.mission_id AND status = 'APPROVED') AS approved_count
        FROM mission_registrations mr
        JOIN surgical_missions sm ON sm.id = mr.mission_id
        WHERE mr.id = ?
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [registration_id]);
    return rows.length > 0 ? rows[0] : null;
}
async function approve(registration_id) {
    const sql = `
        UPDATE mission_registrations
        SET status = 'APPROVED'
        WHERE id = ?
    `;
    const [result] = await db.query(sql, [registration_id]);
    return result.affectedRows > 0;
}
module.exports = {
    registrationExists,
    approve
};
