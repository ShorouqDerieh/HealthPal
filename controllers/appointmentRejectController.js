// controllers/appointmentRejectController.js
const AppointmentRejectService = require('../services/appointmentRejectService.js');
async function reject(req, res) {
    try {
        const { doctor_user_id, appointment_id } = req.body;

        const rejectedId = await AppointmentRejectService.reject(
            doctor_user_id,
            appointment_id
        );

        return res.status(200).json({
            message: "Appointment rejected",
            appointment_id: rejectedId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { reject };

