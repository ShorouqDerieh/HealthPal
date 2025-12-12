const db = require('../database');

class File {
  static async saveFile(ownerUserId, url, mime, sha256 = null) {
    const sql = `
      INSERT INTO files (owner_user_id, storage_url, mime, sha256, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [ownerUserId, url, mime, sha256]);
    return { id: result.insertId };
  }
  static async getFileById(id) {
    const sql = `SELECT * FROM files WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }
}
module.exports = File;