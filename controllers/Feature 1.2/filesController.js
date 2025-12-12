
const pool = require("../../database");


async function uploadFileMeta(req, res) {
  const userId = req.user?.id;
  const { storage_url, mime, sha256 } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO files (owner_user_id, storage_url, mime, sha256, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, storage_url, mime || null, sha256 || null]
    );

    const fileId = result.insertId;

    const [rows] = await conn.query(
      `SELECT id, owner_user_id, storage_url, mime, sha256, created_at
         FROM files
        WHERE id = ?`,
      [fileId]
    );

    return res.status(201).json({
      message: "File metadata stored",
      file: rows[0],
    });
  } catch (err) {
    console.error("uploadFileMeta error:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}


async function getFileMeta(req, res) {
  const userId = req.user?.id;
  const fileId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, owner_user_id, storage_url, mime, sha256, created_at
         FROM files
        WHERE id = ?`,
      [fileId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ file: rows[0] });
  } catch (err) {
    console.error("getFileMeta error:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}

module.exports = {
  uploadFileMeta,
  getFileMeta,
};
