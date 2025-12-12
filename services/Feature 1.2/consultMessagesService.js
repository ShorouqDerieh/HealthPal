const { ensureSessionParticipant } = require("../../repositories/Feature 1.2/consultCommonRepository");

class ConsultMessagesService {
  constructor(repository) {
    this.repository = repository;
  }

  async postMessage(user, params, body) {
    const userId = user?.id;
    const sessionId = params.id;
    const { body: text, file_id } = body;

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

      const messageType = file_id ? "file" : "text";

      const messageId = await this.repository.insertMessage(conn, [
        session.id,
        userId,
        messageType,
        text || null,
        file_id || null,
      ]);

      const msg = await this.repository.getMessageById(conn, messageId);
      await conn.commit();

      return {
        status: 201,
        payload: { message: "Message sent", data: msg },
      };
    } catch (e) {
      await conn.rollback();
      return { status: 500, payload: { message: "Internal server error" } };
    } finally {
      conn.release();
    }
  }

  async listMessages(user, params, query) {
    const userId = user?.id;
    const sessionId = params.id;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const conn = await this.repository.getConnection();
    try {
      const { session, error, status } =
        await ensureSessionParticipant(conn, sessionId, userId);
      if (error) {
        return { status, payload: { message: error } };
      }

      let page = query.page ? Number(query.page) : 1;
      let pageSize = query.pageSize ? Number(query.pageSize) : 50;
      const offset = (page - 1) * pageSize;

      let sql = `
        SELECT id, session_id, sender_user_id, message_type, body, file_id, created_at
          FROM consult_messages
         WHERE session_id = ?`;
      const paramsSql = [session.id];

      if (query.since) {
        sql += " AND created_at > ?";
        paramsSql.push(new Date(query.since));
      }

      sql += " ORDER BY created_at ASC LIMIT ? OFFSET ?";
      paramsSql.push(pageSize, offset);

      const rows = await this.repository.listMessages(conn, sql, paramsSql);

      return {
        status: 200,
        payload: {
          session_id: session.id,
          page,
          pageSize,
          count: rows.length,
          messages: rows,
        },
      };
    } finally {
      conn.release();
    }
  }
  async listUnreadMessages(user, params, query) {
    const userId = user?.id;
    const sessionId = params.id;
    const { since } = query;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }
    if (!since) {
      return { status: 400, payload: { message: "Query parameter 'since' is required" } };
    }

    const conn = await this.repository.getConnection();
    try {
      const { session, error, status } = await ensureSessionParticipant(conn, sessionId, userId);
      if (error) {
        return { status, payload: { message: error } };
      }

      const rows = await this.repository.listUnreadMessages(conn, session.id, new Date(since));

      return {
        status: 200,
        payload: {
          session_id: session.id,
          unread_count: rows.length,
          messages: rows,
        },
      };
    } catch (err) {
      return { status: 500, payload: { message: "Internal server error" } };
    } finally {
      conn.release();
    }
  }

  async streamMessages(user, params, query) {
    const userId = user?.id;
    const sessionId = params.id;
    const since = query.since ? new Date(query.since) : null;

    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const conn = await this.repository.getConnection();
    try {
      const { session, error, status } = await ensureSessionParticipant(conn, sessionId, userId);
      if (error) {
        return { status, payload: { message: error } };
      }

      const end = Date.now() + 10_000;
      while (Date.now() < end) {
        const rows = await this.repository.streamQuery(conn, session.id, since);

        if (rows.length) {
          return {
            status: 200,
            payload: {
              session_id: session.id,
              count: rows.length,
              messages: rows,
            },
          };
        }

        await new Promise((r) => setTimeout(r, 700));
      }

      return {
        status: 200,
        payload: { session_id: session.id, count: 0, messages: [] },
      };
    } catch (err) {
      return { status: 500, payload: { message: "Internal server error" } };
    } finally {
      conn.release();
    }
  }
}

module.exports = ConsultMessagesService;
