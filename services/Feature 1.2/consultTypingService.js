const { ensureSessionParticipant } = require("../../repositories/Feature 1.2/consultCommonRepository");

const typingState = new Map();

class ConsultTypingService {
  async setTypingStatus(user, params, body, pool) {
    const userId = user?.id;
    const sessionId = String(params.id);
    const { is_typing } = body;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const conn = await pool.getConnection();
    try {
      const { error, status } =
        await ensureSessionParticipant(conn, sessionId, userId);
      if (error) {
        return { status, payload: { message: error } };
      }
    } finally {
      conn.release();
    }

    typingState.set(sessionId, {
      userId,
      isTyping: !!is_typing,
      updatedAt: Date.now(),
    });

    return {
      status: 200,
      payload: {
        message: "Typing status updated",
        session_id: Number(sessionId),
        is_typing: !!is_typing,
      },
    };
  }

  async getTypingStatus(user, params) {
    const userId = user?.id;
    const sessionId = String(params.id);

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const state = typingState.get(sessionId);
    if (!state || Date.now() - state.updatedAt > 15_000 || !state.isTyping) {
      return {
        status: 200,
        payload: { session_id: Number(sessionId), is_typing: false },
      };
    }

    return {
      status: 200,
      payload: {
        session_id: Number(sessionId),
        is_typing: true,
        user_id: state.userId,
      },
    };
  }
}

module.exports = ConsultTypingService;
