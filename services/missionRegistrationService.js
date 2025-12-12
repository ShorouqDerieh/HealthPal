// services/missionRegistrationService.js
const Model = require('../repositories/missionRegistrationModel.js');

async function register(mission_id, patient_user_id, notes) {

    if (!mission_id || !patient_user_id) {
        throw { status: 400, message: "Missing mission_id or patient_user_id" };
    }

    // check mission exists
    const mission = await Model.missionExists(mission_id);
    if (!mission) {
        throw { status: 404, message: "Mission not found" };
    }

    // check patient exists
    if (!await Model.patientExists(patient_user_id)) {
        throw { status: 404, message: "Patient not found" };
    }

    // check duplicate registration
    if (await Model.isAlreadyRegistered(mission_id, patient_user_id)) {
        throw {
            status: 400,
            message: "Patient already registered for this mission"
        };
    }

    // check max capacity
    const current = await Model.countRegistrations(mission_id);
    if (current >= mission.max_patients) {
        throw { status: 400, message: "Mission registration is full" };
    }

    const registration_id = await Model.register(
        mission_id,
        patient_user_id,
        notes || null
    );

    return registration_id;
}
module.exports = {
    register
};
