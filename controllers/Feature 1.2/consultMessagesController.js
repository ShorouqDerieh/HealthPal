const ConsultMessagesRepository = require("../../repositories/Feature 1.2/consultMessagesRepository");
const ConsultMessagesService = require("../../services/Feature 1.2/consultMessagesService");

const repository = new ConsultMessagesRepository();
const service = new ConsultMessagesService(repository);

async function postMessage(req, res) {
  const result = await service.postMessage(req.user, req.params, req.body);
  return res.status(result.status).json(result.payload);
}

async function listMessages(req, res) {
  const result = await service.listMessages(req.user, req.params, req.query);
  return res.status(result.status).json(result.payload);
}
async function listUnreadMessages(req, res) {
  const result = await service.listUnreadMessages(req.user, req.params, req.query);
  return res.status(result.status).json(result.payload);
}


async function streamMessages(req, res) {
  const result = await service.streamMessages(req.user, req.params, req.query);
  return res.status(result.status).json(result.payload);
}

module.exports = { postMessage, listMessages, listUnreadMessages, streamMessages };
