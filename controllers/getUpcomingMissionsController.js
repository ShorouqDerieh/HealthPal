const Model = require('../repositories/getUpcomingMissionsModel.js');
async function list(req, res) {
    try {
        const missions = await Model.getUpcoming();

        return res.status(200).json({
            count: missions.length,
            missions
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { list };
