// controllers/appointmentApproveController.js
const AppointmentService = require('../services/appointmentApproveService.js');
async function approve(req, res) {
    try {
        const { doctor_user_id, appointment_id } = req.body;

        const approvedId = await AppointmentService.approve(
            doctor_user_id,
            appointment_id
        );

        return res.status(200).json({
            message: "Appointment approved",
            appointment_id: approvedId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { approve };
