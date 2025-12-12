const db=require('../database')
class OrgMemberShip{
    static async getOrgForUser(userId) {
    const [rows] = await db.query(
      `
      SELECT org_id, role_in_org
      FROM user_org_memberships
      WHERE user_id = ?
      `,
      [userId]
    );

    return rows[0] || null;
  }
}
module.exports=OrgMemberShip