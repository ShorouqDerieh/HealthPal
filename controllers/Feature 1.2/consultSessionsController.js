
const pool = require("../../database");
const {
  ensureAppointmentParticipant,
  ensureSessionParticipant,
} = require("./consultCommon");


async function startAudioSession(req, res) {
  const userId = req.user?.id;
  const { appointment_id } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { appt, error, status } = await ensureAppointmentParticipant(
      conn,
      appointment_id,
      userId
    );
    if (error) {
      await conn.rollback();
      return res.status(status).json({ message: error });
    }

    if (appt.mode !== "audio") {
      await conn.rollback();
      return res.status(400).json({
        message: "This appointment is not configured for audio-only mode",
      });
    }

    const [existing] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE appointment_id = ?
          AND ended_at IS NULL
        ORDER BY started_at DESC
        LIMIT 1`,
      [appt.id]
    );

    if (existing.length) {
      await conn.commit();
      return res.status(200).json({
        message: "Reusing existing audio session",
        session: existing[0],
      });
    }

    const [result] = await conn.query(
      `INSERT INTO consult_sessions (appointment_id, started_at, bandwidth_mode)
       VALUES (?, NOW(), 'low')`,
      [appt.id]
    );

    const sessionId = result.insertId;

    const [sessionRows] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE id = ?`,
      [sessionId]
    );

    await conn.commit();

    return res.status(201).json({
      message: "Audio-only (low-bandwidth) session started",
      session: sessionRows[0],
    });
  } catch (err) {
    console.error("startAudioSession error:", err);
    await conn.rollback();
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}


async function startAsyncSession(req, res) {
  const userId = req.user?.id;
  const { appointment_id } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { appt, error, status } = await ensureAppointmentParticipant(
      conn,
      appointment_id,
      userId
    );
    if (error) {
      await conn.rollback();
      return res.status(status).json({ message: error });
    }

    if (appt.mode !== "async") {
      await conn.rollback();
      return res.status(400).json({
        message: "This appointment is not configured for asynchronous messaging mode",
      });
    }

    
    const [existing] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE appointment_id = ?
          AND ended_at IS NULL
        ORDER BY started_at DESC
        LIMIT 1`,
      [appt.id]
    );

    if (existing.length) {
      await conn.commit();
      return res.status(200).json({
        message: "Reusing existing async session",
        session: existing[0],
      });
    }

    const [result] = await conn.query(
      `INSERT INTO consult_sessions (appointment_id, started_at, bandwidth_mode)
       VALUES (?, NOW(), 'async')`,
      [appt.id]
    );

    const sessionId = result.insertId;

    const [sessionRows] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE id = ?`,
      [sessionId]
    );

    await conn.commit();

    return res.status(201).json({
      message: "Async (low-bandwidth) session started",
      session: sessionRows[0],
    });
  } catch (err) {
    console.error("startAsyncSession error:", err);
    await conn.rollback();
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}


async function updateBandwidthMode(req, res) {
  const userId = req.user?.id;
  const sessionId = req.params.id;
  const { mode } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { session, error, status } = await ensureSessionParticipant(
      conn,
      sessionId,
      userId
    );
    if (error) {
      await conn.rollback();
      return res.status(status).json({ message: error });
    }

    await conn.query(
      `UPDATE consult_sessions
          SET bandwidth_mode = ?
        WHERE id = ?`,
      [mode, session.id]
    );

    const [rows] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE id = ?`,
      [session.id]
    );

    await conn.commit();

    return res.status(200).json({
      message: "Bandwidth mode updated",
      session: rows[0],
    });
  } catch (err) {
    console.error("updateBandwidthMode error:", err);
    await conn.rollback();
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}


async function endSession(req, res) {
  const userId = req.user?.id;
  const sessionId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { session, error, status } = await ensureSessionParticipant(
      conn,
      sessionId,
      userId
    );
    if (error) {
      await conn.rollback();
      return res.status(status).json({ message: error });
    }

    if (session.ended_at) {
      await conn.rollback();
      return res.status(400).json({ message: "Session is already ended" });
    }

    await conn.query(
      `UPDATE consult_sessions
          SET ended_at = NOW()
        WHERE id = ?`,
      [session.id]
    );

    const [rows] = await conn.query(
      `SELECT id, appointment_id, started_at, ended_at, bandwidth_mode
         FROM consult_sessions
        WHERE id = ?`,
      [session.id]
    );

    await conn.commit();

    return res.status(200).json({
      message: "Session ended",
      session: rows[0],
    });
  } catch (err) {
    console.error("endSession error:", err);
    await conn.rollback();
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}

module.exports = {
  startAudioSession,
  startAsyncSession,
  updateBandwidthMode,
  endSession,
};
