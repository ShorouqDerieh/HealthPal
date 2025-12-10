const db=require('../database')
const emailService=require('../services/emailServices')
class Alert{
    static async createAlert({title,body,severity,region,source,published_at,status,
    expires_at = null,}){
        const sql=`INSERT INTO alerts (title, body, severity, region, source, published_at,created_at,status, expires_at) VALUES 
        (?, ?, ?, ?, ?, ?,NOW(),?,?)`;
        const [result]=await db.query(sql,[title,body,severity,region,source,published_at,status, expires_at]);
       return {
      id: result.insertId,
      title,
      body,
      severity,
      region,
      source,
      published_at: published_at,
      status,
      expires_at:expires_at
    };
    }
    static async showAllAlerts(region=null)
    {
        let sql=`SELECT id,
  title,
  body,
  severity,
  region,
  source,
  published_at,
  expires_at FROM alerts WHERE status='PUBLISHED' AND (expires_at IS NULL OR expires_at > NOW())`
        const params=[];
        if(region)
        {
            sql+=' AND region=?'
            params.push(region)
        }
         sql += ` ORDER BY published_at DESC`;
        const [result]=await db.query(sql,params)
        return result;
    }
    static async showAdminAlert({
    status,
    severity,
    region,
    source,
    fromDate,
    toDate}){
        let sql=`SELECT * FROM alerts WHERE 1=1`
        const params=[]
         if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    if (severity) {
      sql += ` AND severity = ?`;
      params.push(severity);
    }

    if (region) {
      sql += ` AND region = ?`;
      params.push(region);
    }

    if (source) {
      sql += ` AND source = ?`;
      params.push(source);
    }
    if (fromDate) {
      sql += ` AND published_at >= ?`;
      params.push(fromDate);
    }
    if (toDate) {
      sql += ` AND published_at <= ?`;
      params.push(toDate);
    }
    sql += ` ORDER BY created_at DESC`;
     const [rows] = await db.query(sql, params);
     return rows
    }
    static async updateAlert(id,fields){
        const allowed = [
      'title',
      'body',
      'severity',
      'region',
      'source',
      'status',
      'expires_at',
      'published_at',
    ];
      const setParts = [];
    const params = [];
    for(const key of allowed)
    {
         if (Object.prototype.hasOwnProperty.call(fields, key)) {
        if (key === 'published_at' && !fields[key]) {
          continue;
        }
        setParts.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }
     if (setParts.length === 0) {
      return this.findById(id);
    }
    const sql = `
      UPDATE alerts
      SET ${setParts.join(', ')}
      WHERE id = ?
    `;
    params.push(id);
      const [result] = await db.query(sql, params);
    if (result.affectedRows == 0) {
      return null;
    }
        return this.findById(id);
  }
    static async findById(id) {
    const [rows] = await db.query(
      `
      SELECT
        id,
        title,
        body,
        severity,
        region,
        source,
        published_at,
        expires_at,
        status,
        created_at
      FROM alerts
      WHERE id = ?
      `,
      [id]
    );
    return rows[0] || null;
  }
  static async getPublicAlertById(id){
    const [rows] = await db.query(
      `
      SELECT
        id,
        title,
        body,
        severity,
        region,
        source,
        published_at,
        expires_at
      FROM alerts
      WHERE id = ?
       AND status = 'PUBLISHED'
      AND (expires_at IS NULL OR expires_at > NOW())
      `,
      [id]
    );
    return rows[0] || null;
  }
  static async notifyUsers(alert){
    if (!alert.region) {
    console.log(`Alert ${alert.id} has no region, skipping targeted notifications.`);
    return;
  }
  const [rows] = await db.query(
    `
    SELECT
      u.id AS user_id,
      u.full_name,
      u.email,
      COALESCE(np.email_enabled, 1) AS email_enabled,
      COALESCE(np.sms_enabled,   0) AS sms_enabled,
      COALESCE(np.push_enabled,  0) AS push_enabled,
      COALESCE(np.lang, u.locale) AS lang,
      p.city,
      p.country
    FROM users u
    JOIN patient_profiles p
      ON p.user_id = u.id
    LEFT JOIN notification_preferences np
      ON np.user_id = u.id
    WHERE p.city = ?
    `,
    [alert.region]
  );
  if (!rows || rows.length === 0) {
    console.log(`No patients found in city ${alert.region} for alert ${alert.id}`);
    return;
  }
  console.log(`Found ${rows.length} users in ${alert.region} for alert ${alert.id}`);
  for (const user of rows) {
    const lang = user.lang || 'ar';

    let message;
    if (lang === 'ar') {
      message = `تنبيه صحي(${alert.severity}): ${alert.title} → ${alert.body}`;
    } else {
      message = `Health Alert (${alert.severity}): ${alert.title} → ${alert.body}`;
    }
     console.log(
      `in application To user ${user.user_id} (${user.full_name}) | msg: ${message}`
    );
     if (user.email_enabled) {
     await emailService.sendHealthAlertEmail(user, alert, message);

    }

    if (user.push_enabled) {
      console.log(
        `PUSH To user ${user.user_id} (${user.full_name}) | msg: ${message}`
      );    }

    if (user.sms_enabled) {
      console.log(
        `SMS To user ${user.user_id} (${user.full_name}) | msg: ${message}`
      );
    }
  }
    }
  }
module.exports=Alert