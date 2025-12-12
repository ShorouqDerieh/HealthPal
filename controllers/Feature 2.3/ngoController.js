const TransparencyRepository = require("../../repositories/TransparencyRepository");
const NgoService = require("../../services/Feature 2.3/ngoService");

const repo = new TransparencyRepository();
const service = new NgoService(repo);

exports.listCampaigns = async (req, res, next) => {
  try {
    const result = await service.listCampaigns({
      userId: Number(req.user.id),
      orgId: Number(req.query.org_id),
      filters: req.query,
    });
    res.json(result);
  } catch (e) { next(e); }
};

exports.campaignDetails = async (req, res, next) => {
  try {
    const result = await service.campaignDetails({
      userId: Number(req.user.id),
      orgId: Number(req.query.org_id),
      campaignId: Number(req.params.campaignId),
    });
    res.json(result);
  } catch (e) { next(e); }
};

exports.createDisbursement = async (req, res, next) => {
  try {
    const result = await service.createDisbursement({
      userId: Number(req.user.id),
      orgId: Number(req.body.org_id),
      payload: req.body,
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
};

exports.createDocument = async (req, res, next) => {
  try {
    const result = await service.createDocument({
      userId: Number(req.user.id),
      orgId: Number(req.body.org_id),
      payload: req.body,
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
};
