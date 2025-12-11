const db = require('../database');
async function getMission(mission_id) {
    const sql = `
        SELECT 
            id AS mission_id,
            title,
            location,
            date,
            speciality,
            max_patients,
            description,
            created_at
        FROM surgical_missions
        WHERE id = ?
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [mission_id]);
    return rows.length > 0 ? rows[0] : null;
}
module.exports = {
    getMission
};
