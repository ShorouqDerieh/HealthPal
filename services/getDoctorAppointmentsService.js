// services/getDoctorAppointmentsService.js
const AppointmentsModel = require('../repositories/getDoctorAppointments.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');
async function getAll(doctor_user_id) {

    if (!doctor_user_id) {
        throw { status: 400, message: "Missing doctor_user_id" };
    }
    // verify doctor exists
    if (!await UserModel.exists(doctor_user_id) || !await DoctorModel.isDoctor(doctor_user_id)) {
        throw { status: 404, message: "Doctor not found" };
    }

    const appointments = await AppointmentsModel.getByDoctor(doctor_user_id);

    return appointments;
}
module.exports = {
    getAll
};
