// services/consultSessionsService.js
const {
  ensureAppointmentParticipant,
  ensureSessionParticipant,
} = require("../../repositories/Feature 1.2/consultCommonRepository");

class ConsultSessionsService {
  constructor(repository) {
    this.repository = repository;
  }

  async startAudioSession(user, body) {
    const userId = user?.id;
    const { appointment_id } = body;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const conn = await this.repository.getConnection();
    try {
      await conn.beginTransaction();

      const { appt, error, status } =
        await ensureAppointmentParticipant(conn, appointment_id, userId);
      if (error) {
        await conn.rollback();
        return { status, payload: { message: error } };
      }

      if (appt.mode !== "audio") {
        await conn.rollback();
        return {
          status: 400,
          payload: { message: "This appointment is not configured for audio-only mode" },
        };
      }

      const existing = await this.repository.findActiveSessionByAppointment(conn, appt.id);
      if (existing.length) {
        await conn.commit();
        return {
          status: 200,
          payload: { message: "Reusing existing audio session", session: existing[0] },
        };
      }

      const sessionId = await this.repository.insertSession(conn, appt.id, "low");
      const session = await this.repository.getSessionById(conn, sessionId);

      await conn.commit();
      return {
        status: 201,
        payload: {
          message: "Audio-only (low-bandwidth) session started",
          session,
        },
      };
    } catch (e) {
      await conn.rollback();
      return { status: 500, payload: { message: "Internal server error" } };
    } finally {
      conn.release();
    }
  }

  async startAsyncSession(user, body) {
    const userId = user?.id;
    const { appointment_id } = body;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const conn = await this.repository.getConnection();
    try {
      await conn.beginTransaction();

      const { appt, error, status } =
        await ensureAppointmentParticipant(conn, appointment_id, userId);
      if (error) {
        await conn.rollback();
        return { status, payload: { message: error } };
      }

      if (appt.mode !== "async") {
        await conn.rollback();
        return {
          status: 400,
          payload: {
            message: "This appointment is not configured for asynchronous messaging mode",
          },
        };
      }

      const existing = await this.repository.findActiveSessionByAppointment(conn, appt.id);
      if (existing.length) {
        await conn.commit();
        return {
          status: 200,
          payload: { message: "Reusing existing async session", session: existing[0] },
        };
      }

      const sessionId = await this.repository.insertSession(conn, appt.id, "async");
      const session = await this.repository.getSessionById(conn, sessionId);

      await conn.commit();
      return {
        status: 201,
        payload: {
          message: "Async (low-bandwidth) session started",
          session,
        },
      };
    } catch (e) {
      await conn.rollback();
      return { status: 500, payload: { message: "Internal server error" } };
    } finally {
      conn.release();
    }
  }

  async updateBandwidthMode(user, params, body) {
    const userId = user?.id;
    const sessionId = params.id;
    const { mode } = body;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const conn = await this.repository.getConnection();
    try {
      await conn.beginTransaction();

      const { session, error, status } =
        await ensureSessionParticipant(conn, sessionId, userId);
      if (error) {
        await conn.rollback();
        return { status, payload: { message: error } };
      }

      await this.repository.updateBandwidthMode(conn, session.id, mode);
      const updated = await this.repository.getSessionById(conn, session.id);

      await conn.commit();
      return {
        status: 200,
        payload: { message: "Bandwidth mode updated", session: updated },
      };
    } catch (e) {
      await conn.rollback();
      return { status: 500, payload: { message: "Internal server error" } };
    } finally {
      conn.release();
    }
  }

  async endSession(user, params) {
    const userId = user?.id;
    const sessionId = params.id;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const conn = await this.repository.getConnection();
    try {
      await conn.beginTransaction();

      const { session, error, status } =
        await ensureSessionParticipant(conn, sessionId, userId);
      if (error) {
        await conn.rollback();
        return { status, payload: { message: error } };
      }

      if (session.ended_at) {
        await conn.rollback();
        return { status: 400, payload: { message: "Session is already ended" } };
      }

      await this.repository.endSession(conn, session.id);
      const ended = await this.repository.getSessionById(conn, session.id);

      await conn.commit();
      return {
        status: 200,
        payload: { message: "Session ended", session: ended },
      };
    } catch (e) {
      await conn.rollback();
      return { status: 500, payload: { message: "Internal server error" } };
    } finally {
      conn.release();
    }
  }
}

module.exports = ConsultSessionsService;
