const Model = require('../repositories/getMissionDetailsModel.js');
async function getOne(req, res) {
    try {
        const mission_id = req.params.mission_id;
        if (!mission_id) {
            return res.status(400).json({ error: "Missing mission_id" });
        }
        const mission = await Model.getMission(mission_id);

        if (!mission) {
            return res.status(404).json({ error: "Mission not found" });
        }
        return res.status(200).json(mission);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { getOne };
