const db = require('../database');
async function getAll() {
    const sql = ` SELECT id, name, description, country, created_at FROM ngos ORDER BY created_at DESC `;
    const [rows] = await db.query(sql);
    return rows;
}
module.exports = {
    getAll
};
