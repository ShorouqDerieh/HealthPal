const TransparencyRepository = require("../../repositories/TransparencyRepository");
const AdminService = require("../../services/Feature 2.3/adminService");

const repo = new TransparencyRepository();
const service = new AdminService(repo);

exports.overview = async (req, res, next) => {
  try {
    const result = await service.overview();
    res.json(result);
  } catch (e) { next(e); }
};

exports.listDonations = async (req, res, next) => {
  try {
    const result = await service.listDonations({ filters: req.query });
    res.json(result);
  } catch (e) { next(e); }
};

exports.auditDonation = async (req, res, next) => {
  try {
    const result = await service.auditDonation({
      actorUserId: Number(req.user.id),
      donationId: Number(req.params.donationId),
    });
    res.json(result);
  } catch (e) { next(e); }
};

exports.flagCampaign = async (req, res, next) => {
  try {
    const result = await service.flagCampaign({
      actorUserId: Number(req.user.id),
      payload: req.body,
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
};
