// controllers/getDoctorAppointmentsController.js
const GetDoctorAppointmentsService = require('../services/getDoctorAppointmentsService.js');
async function getAll(req, res) {
    try {
        const doctor_user_id = req.params.doctor_user_id;

        const appointments = await GetDoctorAppointmentsService.getAll(
            doctor_user_id
        );

        return res.status(200).json({
            doctor_user_id,
            appointments
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { getAll };
