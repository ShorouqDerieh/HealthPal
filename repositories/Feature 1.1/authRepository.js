
const pool = require("../../database");

class AuthRepository {
  async getConnection() {
    return pool.getConnection();
  }

  async begin(conn) {
    await conn.beginTransaction();
  }

  async commit(conn) {
    await conn.commit();
  }

  async rollback(conn) {
    await conn.rollback();
  }

  async release(conn) {
    conn.release();
  }

  async findRoleByCode(conn, role) {
    const [rows] = await conn.query(
      `SELECT id FROM roles WHERE code=?`,
      [role]
    );
    return rows[0] || null;
  }

  async insertUser(conn, user) {
    const [res] = await conn.query(
      `INSERT INTO users (email, phone, password_hash, full_name, locale, is_active)
       VALUES (?,?,?,?,?, TRUE)`,
      [
        user.email,
        user.phone,
        user.password_hash,
        user.full_name,
        user.locale
      ]
    );
    return res.insertId;
  }

  async insertUserRole(conn, userId, roleId) {
    await conn.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
      [userId, roleId]
    );
  }

  async findActiveUserByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email=? AND is_active=TRUE`,
      [email]
    );
    return rows[0] || null;
  }

  async findMainRole(userId) {
    const [rows] = await pool.query(
      `SELECT r.code
       FROM user_roles ur
       JOIN roles r ON r.id=ur.role_id
       WHERE ur.user_id=?
       LIMIT 1`,
      [userId]
    );
    return rows[0]?.code || "patient";
  }
}

module.exports = AuthRepository;
