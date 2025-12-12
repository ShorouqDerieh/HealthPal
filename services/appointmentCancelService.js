// services/appointmentCancelService.js
const Model = require('../repositories/appointmentCancel.js');
async function cancel(appointment_id) {

    if (!appointment_id) {
        throw { status: 400, message: "Missing appointment_id" };
    }

    const appt = await Model.appointmentExists(appointment_id);
    if (!appt) {
        throw { status: 404, message: "Appointment not found" };
    }

    if (["CANCELED_BY_PATIENT", "REJECTED", "DONE"].includes(appt.status)) {
        throw {
            status: 400,
            message: `Appointment already ${appt.status}`
        };
    }

    const updated = await Model.cancel(appointment_id);
    if (!updated) {
        throw { status: 500, message: "Failed to cancel appointment" };
    }

    return appointment_id;
}
module.exports = {
    cancel
};
