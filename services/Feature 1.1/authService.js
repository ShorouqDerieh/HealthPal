
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor(repository) {
    this.repository = repository;
  }

  async register(body) {
    const { full_name, email, password, role = "patient", locale = "ar", phone = null } = body;

    if (!full_name || !email || !password) {
      return { status: 400, payload: { message: "Missing full_name/email/password" } };
    }

    const hash = await bcrypt.hash(password, 10);

    const conn = await this.repository.getConnection();
    try {
      await this.repository.begin(conn);

      const roleRow = await this.repository.findRoleByCode(conn, role);
      if (!roleRow) throw new Error(`Role not found: ${role}`);

      const userId = await this.repository.insertUser(conn, {
        email,
        phone,
        password_hash: hash,
        full_name,
        locale
      });

      await this.repository.insertUserRole(conn, userId, roleRow.id);

      await this.repository.commit(conn);

      const token = jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return { status: 201, payload: { token } };
    } catch (e) {
      await this.repository.rollback(conn);
      if (e.code === "ER_DUP_ENTRY") {
        return { status: 409, payload: { message: "Email exists" } };
      }
      return { status: 500, payload: { error: e.message } };
    } finally {
      this.repository.release(conn);
    }
  }

  async login(body) {
    const { email, password } = body;

    const user = await this.repository.findActiveUserByEmail(email);
    if (!user) {
      return { status: 401, payload: { message: "Invalid credentials" } };
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return { status: 401, payload: { message: "Invalid credentials" } };
    }

    const mainRole = await this.repository.findMainRole(user.id);

    const token = jwt.sign(
      { id: user.id, role: mainRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { status: 200, payload: { token } };
  }
}

module.exports = AuthService;
