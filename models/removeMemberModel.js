const db = require('../database');
async function isMember(groupId, userId) {
    const sql = `SELECT user_id FROM support_group_members WHERE group_id = ? AND user_id = ? LIMIT 1 `;
    const [rows] = await db.query(sql, [groupId, userId]);
    return rows.length > 0;
}

async function removeMember(groupId, userId) {
    const sql = ` DELETE FROM support_group_members WHERE group_id = ? AND user_id = ? `;
    const [result] = await db.query(sql, [groupId, userId]);
    return result;
}
module.exports = {
    isMember,
    removeMember
};
