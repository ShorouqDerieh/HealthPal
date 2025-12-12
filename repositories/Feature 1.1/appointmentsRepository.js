
const pool = require("../../database");

class AppointmentsRepository {
  async getConnection() {
    return pool.getConnection();
  }

  async beginTransaction(conn) {
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

  async lockSlotForUpdate(conn, slot_id) {
    const [slotRows] = await conn.query(
      `SELECT id, doctor_user_id, starts_at, ends_at, slot_status
       FROM doctor_availability
       WHERE id=? FOR UPDATE`,
      [slot_id]
    );
    return slotRows[0] || null;
  }

  async insertAppointment(conn, patientId, doctor_id, slot, mode) {
    const [ins] = await conn.query(
      `INSERT INTO appointments
       (patient_user_id, doctor_user_id, starts_at, ends_at, status, mode, appointment_slot_id)
       VALUES (?, ?, ?, ?, 'PENDING', ?, ?)`,
      [patientId, doctor_id, slot.starts_at, slot.ends_at, mode, slot.id]
    );
    return ins;
  }

  async updateSlotToBooked(conn, slotId) {
    await conn.query(`UPDATE doctor_availability SET slot_status='BOOKED' WHERE id=?`, [slotId]);
  }

  async findAppointmentById(id) {
    const [rows] = await pool.query(`SELECT * FROM appointments WHERE id=?`, [id]);
    return rows[0] || null;
  }

  async updateAppointmentStatus(id, status) {
    await pool.query(`UPDATE appointments SET status=? WHERE id=?`, [status, id]);
  }

  async lockAppointmentForUpdate(conn, id) {
    const [rows] = await conn.query(
      `SELECT id, patient_user_id, doctor_user_id, status, appointment_slot_id
         FROM appointments
        WHERE id=? FOR UPDATE`,
      [id]
    );
    return rows[0] || null;
  }

  async updateSlotToOpenIfBooked(conn, appointment_slot_id) {
    await conn.query(
      `UPDATE doctor_availability
          SET slot_status='OPEN'
        WHERE id=? AND slot_status='BOOKED'`,
      [appointment_slot_id]
    );
  }

  async listAppointments(whereSql, params) {
    const sql = `
      SELECT a.id, a.patient_user_id, a.doctor_user_id, a.starts_at, a.ends_at,
             a.status, a.mode, a.appointment_slot_id,
             s.timezone, s.slot_status
        FROM appointments a
        LEFT JOIN doctor_availability s ON s.id = a.appointment_slot_id
       ${whereSql}
       ORDER BY a.starts_at DESC
       LIMIT 200`;
    const [rows] = await pool.query(sql, params);
    return rows;
  }
}

module.exports = AppointmentsRepository;
