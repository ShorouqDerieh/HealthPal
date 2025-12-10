
const db = require('../database');
//is the  group exists
async function groupExists(groupId) {
    const sql = `SELECT id FROM support_groups WHERE id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [groupId]);
    return rows.length > 0;
}
// is thee patient user exists
async function patientExists(userId) {
    const sql = `SELECT user_id FROM patient_profiles WHERE user_id = ? LIMIT 1`;
    const [rows] = await db.query(sql, [userId]);
    return rows.length > 0;
}
// is the useer already in the group
async function isMember(groupId, userId) {
    const sql = `
        SELECT user_id FROM support_group_members
        WHERE group_id = ? AND user_id = ?
        LIMIT 1
    `;
    const [rows] = await db.query(sql, [groupId, userId]);
    return rows.length > 0;
}
//add
async function addMember(data) {
    const sql = ` INSERT INTO support_group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW()) `;

    const [result] = await db.query(sql, [
        data.group_id,
        data.user_id
    ]);

    return result;
}
module.exports = {
    groupExists,
    patientExists,
    isMember,
    addMember
};
