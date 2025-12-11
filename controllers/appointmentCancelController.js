const Model = require('../repositories/appointmentCancelModel.js');
async function cancel(req, res) {
    try {
        const { appointment_id } = req.body;
        if (!appointment_id) {
            return res.status(400).json({ error: "Missing appointment_id" });
        }
        const appt = await Model.appointmentExists(appointment_id);
        if (!appt) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        if (["CANCELED_BY_PATIENT", "REJECTED", "DONE"].includes(appt.status)) {
            return res.status(400).json({ 
                error: `Appointment already ${appt.status}` 
            });
        }
        const updated = await Model.cancel(appointment_id);
        if (!updated) {
            return res.status(500).json({ error: "Failed to cancel appointment" });
        }
        return res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment_id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { cancel };
