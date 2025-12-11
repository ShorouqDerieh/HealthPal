const AppointmentModel = require('../repositories/appointmentApproveModel.js');
const DoctorModel = require('../repositories/doctor.js');
const UserModel = require('../repositories/users.js');
async function approve(req, res) {
    try {
        const { doctor_user_id, appointment_id } = req.body;

        if (!doctor_user_id || !appointment_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // doctor exists?
        if (!await UserModel.exists(doctor_user_id) || !await DoctorModel.isDoctor(doctor_user_id)) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        const appointment = await AppointmentModel.getAppointment(appointment_id);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        // check doctor owns this appointment
        if (appointment.doctor_user_id != doctor_user_id) {
            return res.status(403).json({ error: "Unauthorized: This appointment does not belong to this doctor" });
        }
        // check status
        if (appointment.status !== "PENDING") {
            return res.status(400).json({ error: "Cannot confirm this appointment" });
        }
        await AppointmentModel.approveAppointment(appointment_id);
        return res.status(200).json({
            message: "Appointment approved",
            appointment_id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { approve };
