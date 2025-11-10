
const pool = require("../../database");

async function searchDoctors(req, res) {
  const { specialty } = req.query;

 
  if (specialty) {
    const [rows] = await pool.query(
      `SELECT
         u.id            AS doctor_user_id,
         u.full_name,
         dp.bio,
         dp.is_international,
         s.name          AS specialty
       FROM users u
       JOIN doctor_profiles dp      ON dp.user_id = u.id
       JOIN doctor_specialties ds   ON ds.doctor_user_id = dp.user_id
       JOIN specialties s           ON s.id = ds.specialty_id
       WHERE EXISTS (
         SELECT 1
         FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
         WHERE ur.user_id = u.id AND r.code = 'doctor'
       )
       AND s.name = ?
       ORDER BY u.full_name`,
      [specialty]
    );
    return res.json(rows);
  }

  // no filter → list all doctors
  const [rows] = await pool.query(
    `SELECT
       u.id AS doctor_user_id,
       u.full_name,
       dp.bio,
       dp.is_international
     FROM users u
     JOIN doctor_profiles dp ON dp.user_id = u.id
     WHERE EXISTS (
       SELECT 1
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
       WHERE ur.user_id = u.id AND r.code = 'doctor'
     )
     ORDER BY u.full_name`
  );
  res.json(rows);
}


async function getAvailability(req, res) {
  const { id } = req.params; // doctor_user_id
  const [rows] = await pool.query(
    `SELECT id, starts_at, ends_at, timezone, slot_status
     FROM doctor_availability
     WHERE doctor_user_id = ?
       AND starts_at >= NOW()
     ORDER BY starts_at`,
    [id]
  );
  res.json(rows);
}


async function addAvailability(req, res) {
  const doctorIdFromToken = req.user.id;
  const { id } = req.params;

  if (parseInt(id, 10) !== doctorIdFromToken) {
    return res.status(403).json({ message: "Not your profile" });
    }

  const { starts_at, ends_at, timezone = "Asia/Hebron" } = req.body;
  if (!starts_at || !ends_at) {
    return res.status(400).json({ message: "Missing starts_at/ends_at" });
  }

  const [r] = await pool.query(
    `INSERT INTO doctor_availability
       (doctor_user_id, starts_at, ends_at, timezone, slot_status)
     VALUES (?, ?, ?, ?, 'OPEN')`,
    [doctorIdFromToken, starts_at, ends_at, timezone]
  );

  res.status(201).json({ id: r.insertId });
}

module.exports = { searchDoctors, getAvailability, addAvailability };
