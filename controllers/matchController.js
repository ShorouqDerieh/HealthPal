const service = require('../services/matchService');

exports.createMatch = async (req, res) => service.createMatch(req, res);
