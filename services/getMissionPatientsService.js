// services/getMissionPatientsService.js
const Model = require('../repositories/getMissionPatients.js');
async function list(mission_id) {

    if (!mission_id) {
        throw { status: 400, message: "Missing mission_id" };
    }

    const mission = await Model.missionExists(mission_id);
    if (!mission) {
        throw { status: 404, message: "Mission not found" };
    }

    const patients = await Model.getPatients(mission_id);

    return {
        mission,
        patients
    };
}
module.exports = {
    list
};
