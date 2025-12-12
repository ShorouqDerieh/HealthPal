const db = require('../database');
async function getGroupById(id) {
    const sql = `SELECT * FROM support_groups WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
}
async function deleteGroup(id) {
    const sql = `DELETE FROM support_groups WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
}
module.exports = {
    getGroupById,
    deleteGroup
};

