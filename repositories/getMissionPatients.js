const db = require('../database');
async function missionExists(mission_id) {
    const sql = `SELECT id, title FROM surgical_missions WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [mission_id]);
    return rows.length > 0 ? rows[0] : null;
}
async function getPatients(mission_id) {
    const sql = `
        SELECT 
            mr.id AS registration_id,
            mr.patient_user_id,
            u.full_name,
            u.email,
            u.phone,
            mr.status,
            mr.notes,
            mr.created_at
        FROM mission_registrations mr
        JOIN users u ON u.id = mr.patient_user_id
        WHERE mr.mission_id = ?
        ORDER BY mr.created_at ASC
    `;

    const [rows] = await db.query(sql, [mission_id]);
    return rows;
}

module.exports = {
    missionExists,
    getPatients
};
