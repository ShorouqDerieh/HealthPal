// services/getPatientSessionsService.js
const PatientSessionsModel = require('../repositories/getPatientSessionsModel.js');
const UserModel = require('../repositories/users.js');
async function getByPatient(patientId) {

    if (!await UserModel.exists(patientId))
        throw { status: 404, message: "Patient not found" };

    const sessions = await PatientSessionsModel.getSessionsByPatient(patientId);

    return sessions;
}
module.exports = {
    getByPatient
};
