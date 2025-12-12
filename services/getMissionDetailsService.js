// services/getMissionDetailsService.js
const Model = require('../repositories/getMissionDetailsModel.js');
async function getOne(mission_id) {

    if (!mission_id) {
        throw { status: 400, message: "Missing mission_id" };
    }

    const mission = await Model.getMission(mission_id);
    if (!mission) {
        throw { status: 404, message: "Mission not found" };
    }

    return mission;
}
module.exports = {
    getOne
};
