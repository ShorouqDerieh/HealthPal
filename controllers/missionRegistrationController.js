// controllers/missionRegistrationController.js
const MissionRegistrationService = require('../services/missionRegistrationService.js');

async function register(req, res) {
    try {
        const { mission_id, patient_user_id, notes } = req.body;

        const registrationId = await MissionRegistrationService.register(
            mission_id,
            patient_user_id,
            notes
        );

        return res.status(201).json({
            message: "Patient registered successfully",
            registration_id: registrationId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}

module.exports = { register };
