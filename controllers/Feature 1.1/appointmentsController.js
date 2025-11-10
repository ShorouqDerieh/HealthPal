
const pool = require("../../database");


async function createAppointment(req, res) {
  if (!req.user) return res.status(401).json({ message: "Missing or invalid token" });

  const patientId = req.user.id;
  const { doctor_id, slot_id, reason = null, mode = "audio" } = req.body;

  if (!doctor_id || !slot_id) {
    return res.status(400).json({ message: "doctor_id and slot_id are required" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    
const [slotRows] = await conn.query(
  `SELECT id, doctor_user_id, starts_at, ends_at, slot_status
   FROM doctor_availability
   WHERE id=? FOR UPDATE`,
  [slot_id]
);
const slot = slotRows[0];
if (!slot) { await conn.rollback(); return res.status(400).json({ message: "Slot not found" }); }
if (slot.slot_status !== "OPEN") { await conn.rollback(); return res.status(409).json({ message: "Slot unavailable" }); }
if (slot.doctor_user_id !== Number(doctor_id)) { await conn.rollback(); return res.status(400).json({ message: "Slot does not belong to doctor_id" }); }


const [ins] = await conn.query(
  `INSERT INTO appointments
   (patient_user_id, doctor_user_id, starts_at, ends_at, status, mode, appointment_slot_id)
   VALUES (?, ?, ?, ?, 'PENDING', ?, ?)`,
  [patientId, doctor_id, slot.starts_at, slot.ends_at, mode, slot.id]
);


await conn.query(`UPDATE doctor_availability SET slot_status='BOOKED' WHERE id=?`, [slot.id]);

await conn.commit();
res.status(201).json({ id: ins.insertId, slot_id: slot.id }); }
 catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
}


async function confirmAppointment(req, res) {
  if (!req.user) return res.status(401).json({ message: "Missing or invalid token" });

  const doctorId = req.user.id;
  const { id } = req.params;

  const [rows] = await pool.query(`SELECT * FROM appointments WHERE id=?`, [id]);
  const a = rows[0];
  if (!a) return res.status(404).json({ message: "Not found" });
  if (a.doctor_user_id !== doctorId) return res.status(403).json({ message: "Not your appointment" });
  if (a.status !== "PENDING") return res.status(409).json({ message: "Already processed" });

  await pool.query(`UPDATE appointments SET status='CONFIRMED' WHERE id=?`, [id]);
  res.json({ ok: true });
}


async function getAppointment(req, res) {
  if (!req.user) return res.status(401).json({ message: "Missing or invalid token" });

  const { id } = req.params;
  const caller = req.user;

  const [rows] = await pool.query(`SELECT * FROM appointments WHERE id=?`, [id]);
  const a = rows[0];
  if (!a) return res.status(404).json({ message: "Not found" });

  // only patient, doctor, or admin
  if (![a.patient_user_id, a.doctor_user_id].includes(caller.id) && caller.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(a);
}

async function cancelAppointment(req, res) {
  if (!req.user) return res.status(401).json({ message: "Missing or invalid token" });

  const caller = req.user;
  const { id } = req.params;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT id, patient_user_id, doctor_user_id, status, appointment_slot_id
         FROM appointments
        WHERE id=? FOR UPDATE`,
      [id]
    );
    const a = rows[0];
    if (!a) { await conn.rollback(); return res.status(404).json({ message: "Not found" }); }

    const allowed =
      caller.role === "admin" ||
      caller.id === a.patient_user_id ||
      caller.id === a.doctor_user_id;
    if (!allowed) { await conn.rollback(); return res.status(403).json({ message: "Forbidden" }); }

    if (a.status === "CANCELLED") { await conn.rollback(); return res.status(409).json({ message: "Already cancelled" }); }

    await conn.query(`UPDATE appointments SET status='CANCELLED' WHERE id=?`, [id]);

    
    await conn.query(
      `UPDATE doctor_availability
          SET slot_status='OPEN'
        WHERE id=? AND slot_status='BOOKED'`,
      [a.appointment_slot_id]
    );

    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
}

async function listMyAppointments(req, res) {
  if (!req.user) return res.status(401).json({ message: "Missing or invalid token" });

  const { status, upcoming } = req.query;
  const me = req.user;

  let where = [];
  let params = [];

  if (me.role === "doctor") { where.push("a.doctor_user_id=?"); params.push(me.id); }
  else if (me.role === "patient") { where.push("a.patient_user_id=?"); params.push(me.id); }

  if (status) { where.push("a.status=?"); params.push(status); }
  if (upcoming === "true") { where.push("a.starts_at >= NOW()"); }

  const sql = `
    SELECT a.id, a.patient_user_id, a.doctor_user_id, a.starts_at, a.ends_at,
           a.status, a.mode, a.appointment_slot_id,
           s.timezone, s.slot_status
      FROM appointments a
      LEFT JOIN doctor_availability s ON s.id = a.appointment_slot_id
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY a.starts_at DESC
     LIMIT 200`;
  const [rows] = await pool.query(sql, params);
  res.json(rows);
}

module.exports = { createAppointment, confirmAppointment, getAppointment, cancelAppointment,listMyAppointments};
