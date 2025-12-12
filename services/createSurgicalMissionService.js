// services/createSurgicalMissionService.js
const MissionModel = require('../repositories/surgicalMissionModel.js');

async function create(title, location, date, speciality, max_patients, description) {

    if (!title || !location || !date || !speciality || !max_patients) {
        throw { status: 400, message: "Missing required fields" };
    }

    const mission_id = await MissionModel.createMission(
        title,
        location,
        date,
        speciality,
        max_patients,
        description || null
    );

    return mission_id;
}

module.exports = {
    create
};
