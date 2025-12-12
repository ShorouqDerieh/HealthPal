// controllers/appointmentRequestController.js
const AppointmentRequestService = require('../services/appointmentRequestService.js');
async function request(req, res) {
    try {
        const { patient_user_id, slot_id } = req.body;

        const appointment_id = await AppointmentRequestService.request(
            patient_user_id,
            slot_id
        );
        return res.status(201).json({
            message: "Appointment request submitted",
            appointment_id
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { request };
