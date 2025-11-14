
const pool = require("../../database");
const { ensureSessionParticipant } = require("./consultCommon");


async function postMessage(req, res) {
  const userId = req.user?.id;
  const sessionId = req.params.id;
  const { body, file_id } = req.body;

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

    const messageType = file_id ? "file" : "text";

    const [result] = await conn.query(
      `INSERT INTO consult_messages
         (session_id, sender_user_id, message_type, body, file_id)
       VALUES (?, ?, ?, ?, ?)`,
      [session.id, userId, messageType, body || null, file_id || null]
    );

    const messageId = result.insertId;

    const [rows] = await conn.query(
      `SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
         FROM consult_messages
        WHERE id = ?`,
      [messageId]
    );

    await conn.commit();

    return res.status(201).json({
      message: "Message sent",
      data: rows[0],
    });
  } catch (err) {
    console.error("postMessage error:", err);
    await conn.rollback();
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}


async function listMessages(req, res) {
  const userId = req.user?.id;
  const sessionId = req.params.id;
  const { since } = req.query;

  let page = req.query.page ? Number(req.query.page) : 1;
  let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 50;

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 200) pageSize = 50;

  const offset = (page - 1) * pageSize;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    const { session, error, status } = await ensureSessionParticipant(
      conn,
      sessionId,
      userId
    );
    if (error) {
      return res.status(status).json({ message: error });
    }

    let sql = `
      SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
        FROM consult_messages
       WHERE session_id = ?`;
    const params = [session.id];

    if (since) {
      sql += ` AND created_at > ?`;
      params.push(new Date(since));
    }

    sql += ` ORDER BY created_at ASC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const [rows] = await conn.query(sql, params);

    return res.status(200).json({
      session_id: session.id,
      page,
      pageSize,
      count: rows.length,
      messages: rows,
    });
  } catch (err) {
    console.error("listMessages error:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}


async function listUnreadMessages(req, res) {
  const userId = req.user?.id;
  const sessionId = req.params.id;
  const { since } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }
  if (!since) {
    return res.status(400).json({ message: "Query parameter 'since' is required" });
  }

  const conn = await pool.getConnection();
  try {
    const { session, error, status } = await ensureSessionParticipant(
      conn,
      sessionId,
      userId
    );
    if (error) {
      return res.status(status).json({ message: error });
    }

    const [rows] = await conn.query(
      `SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
         FROM consult_messages
        WHERE session_id = ?
          AND created_at > ?
        ORDER BY created_at ASC`,
      [session.id, new Date(since)]
    );

    return res.status(200).json({
      session_id: session.id,
      unread_count: rows.length,
      messages: rows,
    });
  } catch (err) {
    console.error("listUnreadMessages error:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}


async function streamMessages(req, res) {
  const userId = req.user?.id;
  const sessionId = req.params.id;
  const since = req.query.since ? new Date(req.query.since) : null;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const conn = await pool.getConnection();
  try {
    const { session, error, status } = await ensureSessionParticipant(
      conn,
      sessionId,
      userId
    );
    if (error) {
      return res.status(status).json({ message: error });
    }

    const end = Date.now() + 10_000;
    while (Date.now() < end) {
      const [rows] = await conn.query(
        `SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
           FROM consult_messages
          WHERE session_id = ?
            ${since ? "AND created_at > ?" : ""}
          ORDER BY created_at ASC`,
        since ? [session.id, since] : [session.id]
      );

      if (rows.length) {
        return res.status(200).json({
          session_id: session.id,
          count: rows.length,
          messages: rows,
        });
      }

      await new Promise((r) => setTimeout(r, 700));
    }

    return res.status(200).json({
      session_id: session.id,
      count: 0,
      messages: [],
    });
  } catch (err) {
    console.error("streamMessages error:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
}

module.exports = {
  postMessage,
  listMessages,
  listUnreadMessages,
  streamMessages,
};
