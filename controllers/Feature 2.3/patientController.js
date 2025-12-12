const TransparencyRepository = require("../../repositories/Feature 2.3/TransparencyRepository");
const PatientService = require("../../services/Feature 2.3/patientService");

const repo = new TransparencyRepository();
const service = new PatientService(repo);

exports.createFeedback = async (req, res, next) => {
  try {
    const result = await service.createFeedback({
      patientUserId: Number(req.user.id),
      payload: req.body,
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
};

exports.myFeedback = async (req, res, next) => {
  try {
    const result = await service.myFeedback({
      patientUserId: Number(req.user.id),
      filters: req.query,
    });
    res.json(result);
  } catch (e) { next(e); }
};
