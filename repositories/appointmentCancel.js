const db = require('../database');
async function appointmentExists(appointment_id) {
    const sql = `SELECT id, status FROM appointments WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [appointment_id]);
    return rows.length > 0 ? rows[0] : null;
}
async function cancel(appointment_id) {
    const sql = `
        UPDATE appointments
        SET status = 'CANCELLED'
        WHERE id = ?
    `;
    const [result] = await db.query(sql, [appointment_id]);
    return result.affectedRows > 0;
}
module.exports = {
    appointmentExists,
    cancel
};
