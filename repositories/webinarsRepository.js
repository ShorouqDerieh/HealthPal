const db=require('../database')
class Webinar{
    static async createWebinar({ title, description, starts_at, ends_at, host_org_id, meeting_link, location }){
            const sql=`INSERT INTO webinars (title, description, starts_at, ends_at, host_org_id, meeting_link, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)`
      const [result]=await db.query(sql,[title,description||null,starts_at,ends_at,host_org_id||null,meeting_link||null,
        location||null])
      return  result.insertId 
    }
    static async showAllWebinars({ upcomingOnly = true, hostOrgId, search } = {})

    {
         const conditions = [];
    const params = [];
    if (upcomingOnly) {
      conditions.push('w.starts_at >= NOW()');
    }
    if (hostOrgId) {
      conditions.push('w.host_org_id = ?');
      params.push(hostOrgId);
    }
    if (search) {
      conditions.push('w.title LIKE ?');
      params.push(`%${search}%`);
    }
     const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
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
        o.type AS host_org_type
      FROM webinars w
      LEFT JOIN organizations o ON w.host_org_id = o.id
      ${whereSql}
      ORDER BY w.starts_at ASC
      `,
      params
    );
    return rows;
    }
    static async showWebinarById(id){
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
      o.type AS host_org_type
    FROM webinars w
    LEFT JOIN organizations o ON w.host_org_id = o.id
    WHERE w.id = ?
    `,
    [id]
  );
  return rows[0]||null
    }
    static async updateWebinar(id, fields) {
  const allowedFields = [
    'title',
    'description',
    'starts_at',
    'ends_at',
    'host_org_id',
    'meeting_link',
    'location',
  ];
  const setParts = [];
  const params = [];

  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      setParts.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (!setParts.length) {
    return 0;
  }

  params.push(id);
  const [result] = await db.query(
    `
    UPDATE webinars
    SET ${setParts.join(', ')}
    WHERE id = ?
    `,
    params
  );

  return result.affectedRows; 
}
static async deleteWebinar(id) {
  const [result] = await db.query(
    `
    DELETE FROM webinars
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows; 
}
}
module.exports=Webinar