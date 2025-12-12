// controllers/getDoctorSessionsController.js
const GetDoctorSessionsService = require('../services/getDoctorSessionsService.js');
module.exports = {
    async getByDoctor(req, res) {
        try {
            const doctorId = req.params.id;
            const sessions = await GetDoctorSessionsService.getByDoctor(
                doctorId
            );
            return res.status(200).json({
                doctor_id: doctorId,
                sessions
            });
        } catch (err) {
            return res.status(err.status || 500).json({
                error: err.message
            });
        }
    }
};
