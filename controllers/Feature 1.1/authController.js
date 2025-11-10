
const pool = require("../../database");   
const bcrypt = require("bcryptjs");    
const jwt = require("jsonwebtoken");   

async function register(req, res) {
  
  const { full_name, email, password, role = "patient", locale = "ar", phone = null } = req.body;
  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "Missing full_name/email/password" });
  }

  const hash = await bcrypt.hash(password, 10);       


  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    
    const [roleRows] = await conn.query(`SELECT id FROM roles WHERE code=?`, [role]);
    if (!roleRows[0]) throw new Error(`Role not found: ${role}`);

    const [userIns] = await conn.query(
      `INSERT INTO users (email, phone, password_hash, full_name, locale, is_active)
       VALUES (?,?,?,?,?, TRUE)`,
      [email, phone, hash, full_name, locale]
    );

    await conn.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
      [userIns.insertId, roleRows[0].id]
    );

    await conn.commit();

    const token = jwt.sign({ id: userIns.insertId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token });
  } catch (e) {
    await conn.rollback();
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email exists" }); // unique email
    res.status(500).json({ error: e.message });
  } finally {
    conn.release(); 
  }
}

async function login(req, res) {
  const { email, password } = req.body;  
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email=? AND is_active=TRUE`,
    [email]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash); 
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

 
  const [roleRows] = await pool.query(
    `SELECT r.code FROM user_roles ur JOIN roles r ON r.id=ur.role_id WHERE ur.user_id=? LIMIT 1`,
    [user.id]
  );
  const mainRole = roleRows[0]?.code || "patient";


  const token = jwt.sign({ id: user.id, role: mainRole }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
}

module.exports = { register, login };
