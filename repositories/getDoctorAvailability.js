const db = require('../database');

async function getByDoctor(doctor_user_id) {
    const sql = `
        SELECT id, doctor_user_id, starts_at, ends_at, timezone, slot_status, created_at
        FROM doctor_availability
        WHERE doctor_user_id = ?
        ORDER BY starts_at ASC
    `;
    const [rows] = await db.query(sql, [doctor_user_id]);
    return rows;
}

module.exports = {
    getByDoctor
};
