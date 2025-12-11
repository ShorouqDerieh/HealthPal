const Model = require('../repositories/missionRegistrationModel.js');

async function register(req, res) {
    try {
        const { mission_id, patient_user_id, notes } = req.body;

        if (!mission_id || !patient_user_id) {
            return res.status(400).json({ error: "Missing mission_id or patient_user_id" });
        }
        // check mission exists
        const mission = await Model.missionExists(mission_id);
        if (!mission) {
            return res.status(404).json({ error: "Mission not found" });
        }
        // check patient exists
        if (!await Model.patientExists(patient_user_id)) {
            return res.status(404).json({ error: "Patient not found" });
        }
        // check duplicate registration
        if (await Model.isAlreadyRegistered(mission_id, patient_user_id)) {
            return res.status(400).json({ error: "Patient already registered for this mission" });
        }
        // check max capacity
        const current = await Model.countRegistrations(mission_id);
        if (current >= mission.max_patients) {
            return res.status(400).json({ error: "Mission registration is full" });
        }
        const registration_id = await Model.register(
            mission_id,
            patient_user_id,
            notes || null
        );

        return res.status(201).json({
            message: "Patient registered successfully",
            registration_id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { register };
