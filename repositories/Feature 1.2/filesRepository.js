const pool = require("../../database");

class FilesRepository {
  async insertFile(userId, data) {
    const [res] = await pool.query(
      `INSERT INTO files (owner_user_id, storage_url, mime, sha256, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, data.storage_url, data.mime, data.sha256]
    );
    return res.insertId;
  }

  async getFileById(id) {
    const [rows] = await pool.query(
      `SELECT id, owner_user_id, storage_url, mime, sha256, created_at
         FROM files WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
}

module.exports = FilesRepository;
