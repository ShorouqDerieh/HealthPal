const pool = require("../../database");
const ConsultTypingService = require("../../services/Feature 1.2/consultTypingService");

const service = new ConsultTypingService();

async function setTypingStatus(req, res) {
  const result = await service.setTypingStatus(req.user, req.params, req.body, pool);
  return res.status(result.status).json(result.payload);
}

async function getTypingStatus(req, res) {
  const result = await service.getTypingStatus(req.user, req.params);
  return res.status(result.status).json(result.payload);
}

module.exports = { setTypingStatus, getTypingStatus };
