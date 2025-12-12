const service = require('../services/healthGuideService');

exports.getAllGuides = async (req, res) => service.getAllGuides(req, res);

exports.getGuideById = async (req, res) => service.getGuideById(req, res);

exports.createGuide = async (req, res) => service.createGuide(req, res);

exports.editGuide = async (req, res) => service.editGuide(req, res);

exports.deleteGuide = async (req, res) => service.deleteGuide(req, res);
