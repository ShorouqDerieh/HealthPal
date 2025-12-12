const ConsultSessionsRepository = require("../../repositories/Feature 1.2/consultSessionsRepository");
const ConsultSessionsService = require("../../services/Feature 1.2/consultSessionsService");

const repository = new ConsultSessionsRepository();
const service = new ConsultSessionsService(repository);

async function startAudioSession(req, res) {
  const result = await service.startAudioSession(req.user, req.body);
  return res.status(result.status).json(result.payload);
}

async function startAsyncSession(req, res) {
  const result = await service.startAsyncSession(req.user, req.body);
  return res.status(result.status).json(result.payload);
}

async function updateBandwidthMode(req, res) {
  const result = await service.updateBandwidthMode(req.user, req.params, req.body);
  return res.status(result.status).json(result.payload);
}

async function endSession(req, res) {
  const result = await service.endSession(req.user, req.params);
  return res.status(result.status).json(result.payload);
}

module.exports = {
  startAudioSession,
  startAsyncSession,
  updateBandwidthMode,
  endSession,
};
