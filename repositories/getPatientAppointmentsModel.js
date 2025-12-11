const db = require('../database');
async function getByPatient(patient_user_id) {
    const sql = `
        SELECT 
            id AS appointment_id,
            patient_user_id,
            doctor_user_id,
            starts_at,
            ends_at,
            status,
            mode
        FROM appointments
        WHERE patient_user_id = ?
        ORDER BY starts_at ASC
    `;

    const [rows] = await db.query(sql, [patient_user_id]);
    return rows;
}
module.exports = {
    getByPatient
};
