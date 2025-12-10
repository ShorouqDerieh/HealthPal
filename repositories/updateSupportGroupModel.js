const db = require('../database');
async function getGroupById(id) {
    const sql = `SELECT * FROM support_groups WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}
async function updateGroup(id, data) {
    const sql = ` UPDATE support_groups SET name = ?, description = ?, category = ? WHERE id = ? `;
const [result] = await db.query(sql, [
        data.name,
        data.description,
        data.category,
        id
    ]);
    return result;
}
module.exports = {
    getGroupById,
    updateGroup
};
