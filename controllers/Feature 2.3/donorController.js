const TransparencyRepository = require("../../repositories/Feature 2.3/TransparencyRepository");
const DonorService = require("../../services/Feature 2.3/donorService");

const repo = new TransparencyRepository();
const service = new DonorService(repo);

exports.summary = async (req, res, next) => {
  try {
    const result = await service.summary({ donorUserId: Number(req.user.id), filters: req.query });
    res.json(result);
  } catch (e) { next(e); }
};

exports.listDonations = async (req, res, next) => {
  try {
    const result = await service.listDonations({ donorUserId: Number(req.user.id), filters: req.query });
    res.json(result);
  } catch (e) { next(e); }
};

exports.donationDetails = async (req, res, next) => {
  try {
    const result = await service.donationDetails({
      donorUserId: Number(req.user.id),
      donationId: Number(req.params.id),
    });
    res.json(result);
  } catch (e) { next(e); }
};

exports.publicFeedback = async (req, res, next) => {
  try {
    const result = await service.publicFeedback({
      donorUserId: Number(req.user.id),
      donationId: Number(req.params.donationId),
    });
    res.json(result);
  } catch (e) { next(e); }
};
