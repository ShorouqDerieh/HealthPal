const service = require('../services/healthAlertsService');

exports.CreateAlert = async (req, res) => service.CreateAlert(req, res);

exports.showAllAlerts = async (req, res) => service.showAllAlerts(req, res);

exports.showAdminAlerts = async (req, res) => service.showAdminAlerts(req, res);

exports.updateAlert = async (req, res) => service.updateAlert(req, res);

exports.getPublicAlertById = async (req, res) => service.getPublicAlertById(req, res);

exports.getAdminAlertById = async (req, res) => service.getAdminAlertById(req, res);

exports.markAlertAsRead = async (req, res) => service.markAlertAsRead(req, res);

exports.getUnreadAlerts = async (req, res) => service.getUnreadAlerts(req, res);
