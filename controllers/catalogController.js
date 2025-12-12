const service = require('../services/catalogService');

exports.viewAllListings = async (req, res) => service.viewAllListings(req, res);

exports.ViewOneItem = async (req, res) => service.ViewOneItem(req, res);

exports.addNewItem = async (req, res) => service.addNewItem(req, res);
