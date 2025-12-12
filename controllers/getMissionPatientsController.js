// controllers/getMissionPatientsController.js
const GetMissionPatientsService = require('../services/getMissionPatientsService.js');
async function list(req, res) {
    try {
        const mission_id = req.params.mission_id;

        const { mission, patients } =
            await GetMissionPatientsService.list(mission_id);

        return res.status(200).json({
            mission_id,
            mission_title: mission.title,
            total_registrations: patients.length,
            patients
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { list };
