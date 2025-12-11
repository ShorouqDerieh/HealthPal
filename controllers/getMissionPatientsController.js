const Model = require('../repositories/getMissionPatientsModel.js');
async function list(req, res) {
    try {
        const mission_id = req.params.mission_id;

        if (!mission_id) {
            return res.status(400).json({ error: "Missing mission_id" });
        }

        const mission = await Model.missionExists(mission_id);
        if (!mission) {
            return res.status(404).json({ error: "Mission not found" });
        }

        const patients = await Model.getPatients(mission_id);

        return res.status(200).json({
            mission_id,
            mission_title: mission.title,
            total_registrations: patients.length,
            patients
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { list };
