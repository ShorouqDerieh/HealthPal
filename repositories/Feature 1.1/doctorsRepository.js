// repositories/doctorsRepository.js
const pool = require("../../database");

class DoctorsRepository {
  async searchBySpecialty(specialty) {
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
    return rows;
  }

  async listAllDoctors() {
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
    return rows;
  }

  async getAvailability(doctorId) {
    const [rows] = await pool.query(
      `SELECT id, starts_at, ends_at, timezone, slot_status
       FROM doctor_availability
       WHERE doctor_user_id = ?
         AND starts_at >= NOW()
       ORDER BY starts_at`,
      [doctorId]
    );
    return rows;
  }

  async insertAvailability(doctorId, data) {
    const [r] = await pool.query(
      `INSERT INTO doctor_availability
       (doctor_user_id, starts_at, ends_at, timezone, slot_status)
       VALUES (?, ?, ?, ?, 'OPEN')`,
      [doctorId, data.starts_at, data.ends_at, data.timezone]
    );
    return r.insertId;
  }
}

module.exports = DoctorsRepository;
