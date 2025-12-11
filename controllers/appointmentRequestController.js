const AppointmentModel = require('../repositories/appointmentRequestModel.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');
async function request(req, res) {
    try {
        const { patient_user_id, slot_id } = req.body;

        if (!patient_user_id || !slot_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // check patient exists
        if (!await UserModel.exists(patient_user_id)) {
            return res.status(404).json({ error: "Patient not found" });
        }
        // check slot exists
        const slot = await AppointmentModel.slotExists(slot_id);
        if (!slot) {
            return res.status(404).json({ error: "Availability slot not found" });
        }
        // check doctor exists
        if (!await DoctorModel.isDoctor(slot.doctor_user_id)) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        // check slot status
        if (slot.slot_status !== 'OPEN') {
            return res.status(400).json({ error: "Slot is not available" });
        }
        // create appointment
        const appointment_id = await AppointmentModel.createAppointment(
            patient_user_id,
            slot.doctor_user_id,
            slot.starts_at,
            slot.ends_at
        );
        // mark slot as booked
        await AppointmentModel.markSlotBooked(slot_id);

        return res.status(201).json({
            message: "Appointment request submitted",
            appointment_id
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { request };
