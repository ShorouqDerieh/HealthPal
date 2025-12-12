// services/getPatientAppointmentsService.js
const AppointmentsModel = require('../repositories/getPatientAppointmentsModel.js');
const UserModel = require('../repositories/users.js');
async function getAll(patient_user_id) {

    if (!patient_user_id) {
        throw { status: 400, message: "Missing patient_user_id" };
    }
    // check patient exists
    if (!await UserModel.exists(patient_user_id)) {
        throw { status: 404, message: "Patient not found" };
    }

    const appointments = await AppointmentsModel.getByPatient(patient_user_id);

    return appointments;
}
module.exports = {
    getAll
};
