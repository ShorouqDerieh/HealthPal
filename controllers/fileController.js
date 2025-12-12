const service = require('../services/fileService');

exports.upload = async (req, res) => service.upload(req, res);
