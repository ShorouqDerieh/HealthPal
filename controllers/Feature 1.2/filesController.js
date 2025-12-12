const FilesRepository = require("../../repositories/Feature 1.2/filesRepository");
const FilesService = require("../../services/Feature 1.2/filesService");

const repository = new FilesRepository();
const service = new FilesService(repository);

async function uploadFileMeta(req, res) {
  const result = await service.uploadFileMeta(req.user, req.body);
  return res.status(result.status).json(result.payload);
}

async function getFileMeta(req, res) {
  const result = await service.getFileMeta(req.user, req.params);
  return res.status(result.status).json(result.payload);
}

module.exports = { uploadFileMeta, getFileMeta };
