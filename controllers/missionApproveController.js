// controllers/missionApproveController.js
const MissionApproveService = require('../services/missionApproveService.js');

async function approve(req, res) {
    try {
        const { registration_id } = req.body;

        const approvedId = await MissionApproveService.approve(
            registration_id
        );

        return res.status(200).json({
            message: "Registration approved successfully",
            registration_id: approvedId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { approve };
