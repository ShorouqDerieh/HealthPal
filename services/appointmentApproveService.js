// services/appointmentApproveService.js
const AppointmentModel = require('../repositories/appointmentApproveModel.js');
const DoctorModel = require('../repositories/doctor.js');
const UserModel = require('../repositories/users.js');
async function approve(doctor_user_id, appointment_id) {

    if (!doctor_user_id || !appointment_id) {
        throw { status: 400, message: "Missing required fields" };
    }
    // doctor exists?
    if (!await UserModel.exists(doctor_user_id) || !await DoctorModel.isDoctor(doctor_user_id)) {
        throw { status: 404, message: "Doctor not found" };
    }

    const appointment = await AppointmentModel.getAppointment(appointment_id);
    if (!appointment) {
        throw { status: 404, message: "Appointment not found" };
    }

    // check doctor owns this appointment
    if (appointment.doctor_user_id != doctor_user_id) {
        throw {
            status: 403,
            message: "Unauthorized: This appointment does not belong to this doctor"
        };
    }

    // check status
    if (appointment.status !== "PENDING") {
        throw { status: 400, message: "Cannot confirm this appointment" };
    }

    await AppointmentModel.approveAppointment(appointment_id);

    return appointment_id;
}
module.exports = {
    approve
};
