const service = require('../services/shortageAlertsService');

exports.getOpenForMyOrg = async (req, res) => service.getOpenForMyOrg(req, res);

exports.resolve = async (req, res) => service.resolve(req, res);

exports.resolveShortageAlert = async (req, res) => service.resolveShortageAlert(req, res);
