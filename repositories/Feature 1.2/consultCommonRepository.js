
async function ensureAppointmentParticipant(conn, appointmentId, userId) {
  const [rows] = await conn.query(
    `SELECT id, patient_user_id, doctor_user_id, status, mode
       FROM appointments
      WHERE id = ?`,
    [appointmentId]
  );

  if (!rows.length) {
    return { error: "Appointment not found", status: 404 };
  }

  const appt = rows[0];

  if (appt.patient_user_id !== userId && appt.doctor_user_id !== userId) {
    return { error: "Forbidden: you are not a participant in this appointment", status: 403 };
  }

  return { appt };
}

async function ensureSessionParticipant(conn, sessionId, userId) {
  const [rows] = await conn.query(
    `SELECT
        cs.id,
        cs.appointment_id,
        cs.bandwidth_mode,
        cs.started_at,
        cs.ended_at,
        a.patient_user_id,
        a.doctor_user_id
       FROM consult_sessions cs
       JOIN appointments a ON a.id = cs.appointment_id
      WHERE cs.id = ?`,
    [sessionId]
  );

  if (!rows.length) {
    return { error: "Session not found", status: 404 };
  }

  const session = rows[0];

  if (session.patient_user_id !== userId && session.doctor_user_id !== userId) {
    return { error: "Forbidden: you are not a participant in this session", status: 403 };
  }

  return { session };
}

module.exports = {
  ensureAppointmentParticipant,
  ensureSessionParticipant,
};
