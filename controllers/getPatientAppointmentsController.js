// controllers/getPatientAppointmentsController.js
const GetPatientAppointmentsService = require('../services/getPatientAppointmentsService.js');

async function getAll(req, res) {
    try {
        const patient_user_id = req.params.patient_user_id;

        const appointments = await GetPatientAppointmentsService.getAll(
            patient_user_id
        );

        return res.status(200).json({
            patient_user_id,
            appointments
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}

module.exports = { getAll };
