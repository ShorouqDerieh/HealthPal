const db = require('../database');
//do user req before
async function requestExists(groupId, userId) {
    const sql = `SELECT id FROM join_requests WHERE group_id = ? AND user_id = ? AND status = 'pending' LIMIT 1 `;
    const [rows] = await db.query(sql, [groupId, userId]);
    return rows.length > 0;
}
//is user member
async function isMember(groupId, userId) {
    const sql = ` SELECT user_id FROM support_group_members WHERE group_id = ? AND user_id = ? LIMIT 1 `;
    const [rows] = await db.query(sql, [groupId, userId]);
    return rows.length > 0;
}
// new req
async function createRequest(groupId, userId) {
    const sql = ` INSERT INTO join_requests (group_id, user_id) VALUES (?, ?) `;
    const [result] = await db.query(sql, [groupId, userId]);
    return result;
}
module.exports = {
    requestExists,
    isMember,
    createRequest
};
