const db = require('../database');
async function missionExists(mission_id) {
    const sql = `SELECT id, max_patients FROM surgical_missions WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [mission_id]);
    return rows.length > 0 ? rows[0] : null;
}
async function patientExists(patient_user_id) {
    const sql = `SELECT user_id FROM patient_profiles WHERE user_id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [patient_user_id]);
    return rows.length > 0;
}
async function countRegistrations(mission_id) {
    const sql = `
        SELECT COUNT(*) AS total 
        FROM mission_registrations 
        WHERE mission_id = ?
    `;
    const [rows] = await db.query(sql, [mission_id]);
    return rows[0].total;
}
async function isAlreadyRegistered(mission_id, patient_user_id) {
    const sql = `
        SELECT id FROM mission_registrations 
        WHERE mission_id = ? AND patient_user_id = ?
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [mission_id, patient_user_id]);
    return rows.length > 0;
}
async function register(mission_id, patient_user_id, notes) {
    const sql = `
        INSERT INTO mission_registrations (mission_id, patient_user_id, notes)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [mission_id, patient_user_id, notes]);
    return result.insertId;
}
module.exports = {
    missionExists,
    patientExists,
    countRegistrations,
    isAlreadyRegistered,
    register
};
