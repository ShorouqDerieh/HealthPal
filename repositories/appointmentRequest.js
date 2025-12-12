const db = require('../database');
async function slotExists(slot_id) {
    const sql = ` SELECT id, doctor_user_id, starts_at, ends_at, slot_status  FROM doctor_availability WHERE id = ? LIMIT 1 `;
    const [rows] = await db.query(sql, [slot_id]);
    return rows.length > 0 ? rows[0] : null;
}
async function createAppointment(patient_user_id, doctor_user_id, starts_at, ends_at) {
    const sql = `
        INSERT INTO appointments (patient_user_id, doctor_user_id, starts_at, ends_at, status, mode)
        VALUES (?, ?, ?, ?, 'PENDING', 'video')
    `;
    const [result] = await db.query(sql, [
        patient_user_id,
        doctor_user_id,
        starts_at,
        ends_at
    ]);

    return result.insertId;
}
async function markSlotBooked(slot_id) {
    const sql = `
        UPDATE doctor_availability
        SET slot_status = 'BOOKED'
        WHERE id = ?
    `;
    await db.query(sql, [slot_id]);
}
module.exports = {
    slotExists,
    createAppointment,
    markSlotBooked
};
