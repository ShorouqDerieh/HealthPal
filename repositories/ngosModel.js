const db = require('../database');
async function createNgo(data) {
    const sql = ` INSERT INTO ngos (name, description, country, created_at) VALUES (?, ?, ?, NOW()) `;
    const [result] = await db.query(sql, [
        data.name,
        data.description,
        data.country
    ]);
    return result.insertId;
}
module.exports = {
    createNgo
};
