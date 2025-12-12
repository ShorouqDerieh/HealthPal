const service = require('../services/deliveryService');

exports.scheduleDelivery = async (req, res) => service.scheduleDelivery(req, res);

exports.changeDeliveryStatus = async (req, res) => service.changeDeliveryStatus(req, res);

exports.addProofFile = async (req, res) => service.addProofFile(req, res);

exports.getMyDeliveres = async (req, res) => service.getMyDeliveres(req, res);

exports.cancelDelivery = async (req, res) => service.cancelDelivery(req, res);
