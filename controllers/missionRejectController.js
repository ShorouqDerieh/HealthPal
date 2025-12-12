// controllers/missionRejectController.js
const MissionRejectService = require('../services/missionRejectService.js');

async function reject(req, res) {
    try {
        const { registration_id } = req.body;

        const rejectedId = await MissionRejectService.reject(
            registration_id
        );

        return res.status(200).json({
            message: "Registration rejected successfully",
            registration_id: rejectedId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { reject };
