const db = require('../database');
async function getAppointment(appointment_id) {
    const sql = `
        SELECT id, patient_user_id, doctor_user_id, starts_at, ends_at, status
        FROM appointments
        WHERE id = ?
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [appointment_id]);
    return rows.length > 0 ? rows[0] : null;
}
async function rejectAppointment(appointment_id) {
    const sql = `
        UPDATE appointments
        SET status = 'CANCELLED'
        WHERE id = ?
    `;
    await db.query(sql, [appointment_id]);
}
module.exports = {
    getAppointment,
    rejectAppointment
};
