const pool = require("../../database");

class ConsultMessagesRepository {
  async getConnection() {
    return pool.getConnection();
  }

  async insertMessage(conn, data) {
    const [result] = await conn.query(
      `INSERT INTO consult_messages
       (session_id, sender_user_id, message_type, body, file_id)
       VALUES (?, ?, ?, ?, ?)`,
      data
    );
    return result.insertId;
  }

  async getMessageById(conn, id) {
    const [rows] = await conn.query(
      `SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
         FROM consult_messages
        WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  async listMessages(conn, sql, params) {
    const [rows] = await conn.query(sql, params);
    return rows;
 
  }
  async listUnreadMessages(conn, sessionId, since) {
    const [rows] = await conn.query(
      `SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
         FROM consult_messages
        WHERE session_id = ?
          AND created_at > ?
        ORDER BY created_at ASC`,
      [sessionId, since]
    );
    return rows;
  }

 
  async streamQuery(conn, sessionId, since) {
    const [rows] = await conn.query(
      `SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
         FROM consult_messages
        WHERE session_id = ?
          ${since ? "AND created_at > ?" : ""}
        ORDER BY created_at ASC`,
      since ? [sessionId, since] : [sessionId]
    );
    return rows;
  }
}

module.exports = ConsultMessagesRepository;
