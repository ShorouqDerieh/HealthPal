const service = require('../services/webinarsService');

exports.allWebinars = async (req, res) => service.allWebinars(req, res);

exports.showOneWebinar = async (req, res) => service.showOneWebinar(req, res);

exports.createWebinar = async (req, res) => service.createWebinar(req, res);

exports.updateWebinar = async (req, res) => service.updateWebinar(req, res);

exports.deleteWebinar = async (req, res) => service.deleteWebinar(req, res);

exports.registerForWebinar = async (req, res) => service.registerForWebinar(req, res);

exports.cancelRegistration = async (req, res) => service.cancelRegistration(req, res);

exports.getMyWebinars = async (req, res) => service.getMyWebinars(req, res);

exports.getWebinarAttendees = async (req, res) => service.getWebinarAttendees(req, res);
