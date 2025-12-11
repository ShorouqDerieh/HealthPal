const MissionModel = require('../repositories/surgicalMissionModel.js');
async function create(req, res) {
    try {
        const { title, location, date, speciality, max_patients, description } = req.body;

        if (!title || !location || !date || !speciality || !max_patients) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const mission_id = await MissionModel.createMission(
            title,
            location,
            date,
            speciality,
            max_patients,
            description || null
        );
        return res.status(201).json({
            message: "Surgical mission created successfully",
            mission_id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { create };
