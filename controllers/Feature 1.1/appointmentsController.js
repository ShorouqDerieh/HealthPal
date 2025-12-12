// controllers/appointmentsController.js
const AppointmentsRepository = require("../../repositories/Feature 1.1/appointmentsRepository");
const AppointmentsService = require("../../services/Feature 1.1/appointmentsService");

const repository = new AppointmentsRepository();
const service = new AppointmentsService(repository);

async function createAppointment(req, res, next) {
  try {
    const result = await service.createAppointment(req.user, req.body);
    return res.status(result.status).json(result.payload);
  } catch (err) {
    next(err);
  }
}

async function confirmAppointment(req, res, next) {
  try {
    const result = await service.confirmAppointment(req.user, req.params);
    return res.status(result.status).json(result.payload);
  } catch (err) {
    next(err);
  }
}

async function getAppointment(req, res, next) {
  try {
    const result = await service.getAppointment(req.user, req.params);
    return res.status(result.status).json(result.payload);
  } catch (err) {
    next(err);
  }
}

async function cancelAppointment(req, res, next) {
  try {
    const result = await service.cancelAppointment(req.user, req.params);
    return res.status(result.status).json(result.payload);
  } catch (err) {
    next(err);
  }
}

async function listMyAppointments(req, res, next) {
  try {
    const result = await service.listMyAppointments(req.user, req.query);
    return res.status(result.status).json(result.payload);
  } catch (err) {
    next(err);
  }
}

module.exports = { createAppointment, confirmAppointment, getAppointment, cancelAppointment, listMyAppointments };
