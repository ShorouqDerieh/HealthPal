const service = require('../services/requestService');

exports.createRequest = async (req, res) => service.createRequest(req, res);

exports.viewRequest = async (req, res) => service.viewRequest(req, res);

exports.viewAllRequests = async (req, res) => service.viewAllRequests(req, res);

exports.viewMyRequests = async (req, res) => service.viewMyRequests(req, res);

exports.UpdateStatus = async (req, res) => service.UpdateStatus(req, res);

exports.createMatch = async (req, res) => service.createMatch(req, res);
