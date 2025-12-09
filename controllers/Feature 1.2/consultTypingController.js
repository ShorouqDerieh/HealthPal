
const pool = require("../../database");
const { ensureSessionParticipant } = require("./consultCommon");

const typingState = new Map(); 


async function setTypingStatus(req, res) {
  const userId = req.user?.id;
  const sessionId = String(req.params.id);
  const { is_typing } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }


  const conn = await pool.getConnection();
  try {
    const { error, status } = await ensureSessionParticipant(conn, sessionId, userId);
    if (error) {
      return res.status(status).json({ message: error });
    }
  } catch (err) {
    console.error("setTypingStatus check error:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }

  const now = Date.now();
  typingState.set(sessionId, {
    userId,
    isTyping: !!is_typing,
    updatedAt: now,
  });

  return res.status(200).json({
    message: "Typing status updated",
    session_id: Number(sessionId),
    is_typing: !!is_typing,
  });
}


async function getTypingStatus(req, res) {
  const userId = req.user?.id;
  const sessionId = String(req.params.id);

  if (!userId) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const state = typingState.get(sessionId);
  if (!state) {
    return res.status(200).json({
      session_id: Number(sessionId),
      is_typing: false,
    });
  }

  const ageMs = Date.now() - state.updatedAt;
  if (ageMs > 15_000 || !state.isTyping) {
    return res.status(200).json({
      session_id: Number(sessionId),
      is_typing: false,
    });
  }

  return res.status(200).json({
    session_id: Number(sessionId),
    is_typing: true,
    user_id: state.userId,
  });
}

module.exports = {
  setTypingStatus,
  getTypingStatus,
};
