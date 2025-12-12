const db = require('../database');
async function getUpcoming() {
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
        WHERE date >= CURDATE()
        ORDER BY date ASC
    `;
    
    const [rows] = await db.query(sql);
    return rows;
}
module.exports = {
    getUpcoming
};
