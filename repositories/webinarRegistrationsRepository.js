const db=require('../database')
class Registration{
    static async createRegistration(webinarId,userId)
    {
        const sql=`INSERT INTO webinar_registrations (webinar_id, user_id)VALUES (?, ?)`
        const [result]=await db.query(sql,[webinarId,userId])
        return result.insertId
    }
      static async findByWebinarAndUser(webinarId, userId) {
    const [rows] = await db.query(
      `
      SELECT *
      FROM webinar_registrations
      WHERE webinar_id = ? AND user_id = ?
      `,
      [webinarId, userId]
    );
    return rows[0] || null;
  }
  static async deleteRegistration(webinarId,userId)
  {
    const [rows]=await db.query(`DELETE FROM webinar_registrations WHERE webinar_id = ? AND user_id = ?`,
        [webinarId,userId]
    )
    return rows.affectedRows;
  }
  static async getUserRegistration(userId){
    const [rows] = await db.query(
      `
      SELECT
        w.id,
        w.title,
        w.description,
        w.starts_at,
        w.ends_at,
        w.location,
        w.meeting_link,
        w.host_org_id,
        o.name AS host_org_name,
        o.type AS host_org_type,
        wr.status,
        wr.registered_at
      FROM webinar_registrations wr
      JOIN webinars w ON wr.webinar_id = w.id
      LEFT JOIN organizations o ON w.host_org_id = o.id
     WHERE wr.user_id=? ORDER BY w.starts_at ASC
      `,
      userId
    );return rows
  }
  static async getAttendeesForWebinar(webinarId) {
    const [rows] = await db.query(
      `
      SELECT
        wr.user_id,
        u.full_name,
        u.email,
        u.phone,
        wr.status,
        wr.registered_at
      FROM webinar_registrations wr
      JOIN users u ON wr.user_id = u.id
      WHERE wr.webinar_id = ?
      ORDER BY wr.registered_at ASC
      `,
      [webinarId]
    );
    return rows;
}
}
module.exports=Registration