const db = require('../database');
async function createMission(title, location, date, speciality, max_patients, description) {
    const sql = `
        INSERT INTO surgical_missions (title, location, date, speciality, max_patients, description, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [
        title,
        location,
        date,
        speciality,
        max_patients,
        description
    ]);

    return result.insertId;
}
module.exports = {
    createMission
};
