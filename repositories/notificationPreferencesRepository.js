const db=require('../database')
class NotificationPreference{
    static async getByUserId(id){
        const sql=`SELECT * FROM notification_preferences WHERE user_id=?`
        const [result]=await db.query(sql,id)
        return result[0]||null
    }
    static async upsert(userId, { email_enabled, sms_enabled, push_enabled, lang }) {
    const sql = `
      INSERT INTO notification_preferences (
        user_id, email_enabled, sms_enabled, push_enabled, lang
      ) VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email_enabled = VALUES(email_enabled),
        sms_enabled   = VALUES(sms_enabled),
        push_enabled  = VALUES(push_enabled),
        lang          = VALUES(lang)
    `;

    await db.query(sql, [
      userId,
      email_enabled,
      sms_enabled,
      push_enabled,
      lang,
    ]);
    return this.getByUserId(userId);
  }
}
module.exports=NotificationPreference