// controllers/appointmentCancelController.js
const AppointmentCancelService = require('../services/appointmentCancelService.js');
async function cancel(req, res) {
    try {
        const { appointment_id } = req.body;

        const canceledId = await AppointmentCancelService.cancel(
            appointment_id
        );

        return res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment_id: canceledId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { cancel };
