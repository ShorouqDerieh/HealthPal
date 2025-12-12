// repositories/consultSessionsRepository.js
const pool = require("../../database");

class ConsultSessionsRepository {
  async getConnection() {
    return pool.getConnection();
  }

  async findActiveSessionByAppointment(conn, appointmentId) {
    const [rows] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE appointment_id = ?
          AND ended_at IS NULL
        ORDER BY started_at DESC
        LIMIT 1`,
      [appointmentId]
    );
    return rows;
  }

  async insertSession(conn, appointmentId, bandwidth_mode) {
    const [res] = await conn.query(
      `INSERT INTO consult_sessions (appointment_id, started_at, bandwidth_mode)
       VALUES (?, NOW(), ?)`,
      [appointmentId, bandwidth_mode]
    );
    return res.insertId;
  }

  async getSessionById(conn, id) {
    const [rows] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  async updateBandwidthMode(conn, id, mode) {
    await conn.query(
      `UPDATE consult_sessions SET bandwidth_mode = ? WHERE id = ?`,
      [mode, id]
    );
  }

  async endSession(conn, id) {
    await conn.query(
      `UPDATE consult_sessions SET ended_at = NOW() WHERE id = ?`,
      [id]
    );
  }
}

module.exports = ConsultSessionsRepository;
