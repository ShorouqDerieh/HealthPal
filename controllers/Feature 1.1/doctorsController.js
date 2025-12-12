
const DoctorsRepository = require("../../repositories/Feature 1.1/doctorsRepository");
const DoctorsService = require("../../services/Feature 1.1/doctorsService");

const repository = new DoctorsRepository();
const service = new DoctorsService(repository);

async function searchDoctors(req, res) {
  const result = await service.searchDoctors(req.query);
  return res.status(result.status).json(result.payload);
}

async function getAvailability(req, res) {
  const result = await service.getAvailability(req.params);
  return res.status(result.status).json(result.payload);
}

async function addAvailability(req, res) {
  const result = await service.addAvailability(req.user, req.params, req.body);
  return res.status(result.status).json(result.payload);
}

module.exports = { searchDoctors, getAvailability, addAvailability };
