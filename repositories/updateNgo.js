const db = require('../database');

async function ngoExists(id) {
    const sql = `SELECT id FROM ngos WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);
    return rows.length > 0;
}

async function updateNgo(id, data) {
    const sql = `
        UPDATE ngos 
        SET name = ?, description = ?, country = ?
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [
        data.name,
        data.description,
        data.country,
        id
    ]);

    return result;
}
module.exports = {
    ngoExists,
    updateNgo
};
