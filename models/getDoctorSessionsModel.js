const db = require('../database');
async function getSessionsByDoctor(doctorId){
        const sql = `
        SELECT
            counseling_sessions.id,
            counseling_sessions.starts_at,
           counseling_sessions.ends_at,
           counseling_sessions.status,
            counseling_sessions.patient_user_id,
           u.full_name AS patient_name
           FROM counseling_sessions
        JOIN users u ON u.id = counseling_sessions.patient_user_id
        WHERE counseling_sessions.counselor_user_id = ?
        ORDER BY counseling_sessions.starts_at DESC
    `;
       const [rows] = await db.query(sql, [doctorId]);
    return rows;
}
module.exports = {
    getSessionsByDoctor
};