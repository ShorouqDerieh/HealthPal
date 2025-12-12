// services/doctorsService.js
class DoctorsService {
  constructor(repository) {
    this.repository = repository;
  }

  async searchDoctors(query) {
    const { specialty } = query;

    if (specialty) {
      const rows = await this.repository.searchBySpecialty(specialty);
      return { status: 200, payload: rows };
    }

    const rows = await this.repository.listAllDoctors();
    return { status: 200, payload: rows };
  }

  async getAvailability(params) {
    const { id } = params;
    const rows = await this.repository.getAvailability(id);
    return { status: 200, payload: rows };
  }

  async addAvailability(user, params, body) {
    const doctorIdFromToken = user.id;
    const { id } = params;

    if (parseInt(id, 10) !== doctorIdFromToken) {
      return { status: 403, payload: { message: "Not your profile" } };
    }

    const { starts_at, ends_at, timezone = "Asia/Hebron" } = body;
    if (!starts_at || !ends_at) {
      return { status: 400, payload: { message: "Missing starts_at/ends_at" } };
    }

    const slotId = await this.repository.insertAvailability(doctorIdFromToken, {
      starts_at,
      ends_at,
      timezone
    });

    return { status: 201, payload: { id: slotId } };
  }
}

module.exports = DoctorsService;
