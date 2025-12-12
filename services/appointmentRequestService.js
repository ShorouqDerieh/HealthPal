// services/appointmentRequestService.js
const AppointmentModel = require('../repositories/appointmentRequest.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');
async function request(patient_user_id, slot_id) {

    if (!patient_user_id || !slot_id) {
        throw { status: 400, message: "Missing required fields" };
    }
    // check patient exists
    if (!await UserModel.exists(patient_user_id)) {
        throw { status: 404, message: "Patient not found" };
    }
    // check slot exists
    const slot = await AppointmentModel.slotExists(slot_id);
    if (!slot) {
        throw { status: 404, message: "Availability slot not found" };
    }
    // check doctor exists
    if (!await DoctorModel.isDoctor(slot.doctor_user_id)) {
        throw { status: 404, message: "Doctor not found" };
    }
    // check slot status
    if (slot.slot_status !== 'OPEN') {
        throw { status: 400, message: "Slot is not available" };
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

    return appointment_id;
}
module.exports = {
    request
};
