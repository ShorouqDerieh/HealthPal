// services/appointmentsService.js
class AppointmentsService {
  /*
    @param {AppointmentsRepository} repository
  */
  constructor(repository) {
    this.repository = repository;
  }

  async createAppointment(user, body) {
    if (!user) return { status: 401, payload: { message: "Missing or invalid token" } };

    const patientId = user.id;
    const { doctor_id, slot_id, reason = null, mode = "audio" } = body;

    if (!doctor_id || !slot_id) {
      return { status: 400, payload: { message: "doctor_id and slot_id are required" } };
    }

    const conn = await this.repository.getConnection();
    try {
      await this.repository.beginTransaction(conn);

      const slot = await this.repository.lockSlotForUpdate(conn, slot_id);

      if (!slot) {
        await this.repository.rollback(conn);
        return { status: 400, payload: { message: "Slot not found" } };
      }
      if (slot.slot_status !== "OPEN") {
        await this.repository.rollback(conn);
        return { status: 409, payload: { message: "Slot unavailable" } };
      }
      if (slot.doctor_user_id !== Number(doctor_id)) {
        await this.repository.rollback(conn);
        return { status: 400, payload: { message: "Slot does not belong to doctor_id" } };
      }

      const ins = await this.repository.insertAppointment(conn, patientId, doctor_id, slot, mode);

      await this.repository.updateSlotToBooked(conn, slot.id);

      await this.repository.commit(conn);
      return { status: 201, payload: { id: ins.insertId, slot_id: slot.id } };
    } catch (e) {
      await this.repository.rollback(conn);
      return { status: 500, payload: { error: e.message } };
    } finally {
      await this.repository.release(conn);
    }
  }

  async confirmAppointment(user, params) {
    if (!user) return { status: 401, payload: { message: "Missing or invalid token" } };

    const doctorId = user.id;
    const { id } = params;

    const a = await this.repository.findAppointmentById(id);
    if (!a) return { status: 404, payload: { message: "Not found" } };
    if (a.doctor_user_id !== doctorId) return { status: 403, payload: { message: "Not your appointment" } };
    if (a.status !== "PENDING") return { status: 409, payload: { message: "Already processed" } };

    await this.repository.updateAppointmentStatus(id, "CONFIRMED");
    return { status: 200, payload: { ok: true } };
  }

  async getAppointment(user, params) {
    if (!user) return { status: 401, payload: { message: "Missing or invalid token" } };

    const { id } = params;
    const caller = user;

    const a = await this.repository.findAppointmentById(id);
    if (!a) return { status: 404, payload: { message: "Not found" } };

    // only patient, doctor, or admin
    if (![a.patient_user_id, a.doctor_user_id].includes(caller.id) && caller.role !== "admin") {
      return { status: 403, payload: { message: "Forbidden" } };
    }

    return { status: 200, payload: a };
  }

  async cancelAppointment(user, params) {
    if (!user) return { status: 401, payload: { message: "Missing or invalid token" } };

    const caller = user;
    const { id } = params;

    const conn = await this.repository.getConnection();
    try {
      await this.repository.beginTransaction(conn);

      const a = await this.repository.lockAppointmentForUpdate(conn, id);
      if (!a) {
        await this.repository.rollback(conn);
        return { status: 404, payload: { message: "Not found" } };
      }

      const allowed =
        caller.role === "admin" ||
        caller.id === a.patient_user_id ||
        caller.id === a.doctor_user_id;

      if (!allowed) {
        await this.repository.rollback(conn);
        return { status: 403, payload: { message: "Forbidden" } };
      }

      if (a.status === "CANCELLED") {
        await this.repository.rollback(conn);
        return { status: 409, payload: { message: "Already cancelled" } };
      }

      await this.repository.updateAppointmentStatus(id, "CANCELLED");

      await this.repository.updateSlotToOpenIfBooked(conn, a.appointment_slot_id);

      await this.repository.commit(conn);
      return { status: 200, payload: { ok: true } };
    } catch (e) {
      await this.repository.rollback(conn);
      return { status: 500, payload: { error: e.message } };
    } finally {
      await this.repository.release(conn);
    }
  }

  async listMyAppointments(user, query) {
    if (!user) return { status: 401, payload: { message: "Missing or invalid token" } };

    const { status, upcoming } = query;
    const me = user;

    let where = [];
    let params = [];

    if (me.role === "doctor") { where.push("a.doctor_user_id=?"); params.push(me.id); }
    else if (me.role === "patient") { where.push("a.patient_user_id=?"); params.push(me.id); }

    if (status) { where.push("a.status=?"); params.push(status); }
    if (upcoming === "true") { where.push("a.starts_at >= NOW()"); }

    const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
    const rows = await this.repository.listAppointments(whereSql, params);

    return { status: 200, payload: rows };
  }
}

module.exports = AppointmentsService;
