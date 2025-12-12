
const AuthRepository = require("../../repositories/Feature 1.1/authRepository");
const AuthService = require("../../services/Feature 1.1/authService");

const repository = new AuthRepository();
const service = new AuthService(repository);

async function register(req, res) {
  const result = await service.register(req.body);
  return res.status(result.status).json(result.payload);
}

async function login(req, res) {
  const result = await service.login(req.body);
  return res.status(result.status).json(result.payload);
}

module.exports = { register, login };
