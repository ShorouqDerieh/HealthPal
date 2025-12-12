class FilesService {
  constructor(repository) {
    this.repository = repository;
  }

  async uploadFileMeta(user, body) {
    const userId = user?.id;
    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const fileId = await this.repository.insertFile(userId, body);
    const file = await this.repository.getFileById(fileId);

    return {
      status: 201,
      payload: { message: "File metadata stored", file },
    };
  }

  async getFileMeta(user, params) {
    const userId = user?.id;
    if (!userId) {
      return { status: 401, payload: { message: "Missing or invalid token" } };
    }

    const file = await this.repository.getFileById(params.id);
    if (!file) {
      return { status: 404, payload: { message: "File not found" } };
    }

    return { status: 200, payload: { file } };
  }
}

module.exports = FilesService;
