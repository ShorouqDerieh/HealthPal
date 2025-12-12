const service = require('../services/notificationPreferencesService');

exports.getMyPreferences = async (req, res) =>
  service.getMyPreferences(req, res);

exports.updateMyPreferences = async (req, res) =>
  service.updateMyPreferences(req, res);
