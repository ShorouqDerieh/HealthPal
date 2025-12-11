const db = require('../database');
async function createAvailability(doctor_user_id, starts_at, ends_at, timezone) {
    const sql = `
        INSERT INTO doctor_availability (doctor_user_id, starts_at, ends_at, timezone, slot_status, created_at)
        VALUES (?, ?, ?, ?, 'OPEN', NOW())
    `;
    const [result] = await db.query(sql, [
        doctor_user_id,
        starts_at,
        ends_at,
        timezone
    ]);
    return result.insertId;
}

module.exports = {
    createAvailability
};
