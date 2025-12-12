// controllers/getMissionDetailsController.js
const GetMissionDetailsService = require('../services/getMissionDetailsService.js');
async function getOne(req, res) {
    try {
        const mission_id = req.params.mission_id;

        const mission = await GetMissionDetailsService.getOne(
            mission_id
        );

        return res.status(200).json(mission);

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { getOne };
