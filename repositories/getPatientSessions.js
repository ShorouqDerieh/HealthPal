const db = require('../database');

async function getSessionsByPatient(patientId) {

    const sql = `
        SELECT 
            counseling_sessions.id,
            counseling_sessions.starts_at,
            counseling_sessions.ends_at,
            counseling_sessions.status,
            counseling_sessions.counselor_user_id,
            u.full_name AS doctor_name
        FROM counseling_sessions 
        JOIN users u ON u.id = cs.counselor_user_id
        WHERE cs.patient_user_id = ?
        ORDER BY cs.starts_at DESC
    `;

    const [rows] = await db.query(sql, [patientId]);
    return rows;
}

module.exports = {
    getSessionsByPatient
};