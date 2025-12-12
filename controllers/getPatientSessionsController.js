// controllers/getPatientSessionsController.js
const GetPatientSessionsService = require('../services/getPatientSessionsService.js');

module.exports = {
    async getByPatient(req, res) {
        try {
            const patientId = req.params.id;

            const sessions = await GetPatientSessionsService.getByPatient(
                patientId
            );

            return res.status(200).json({
                patient_id: patientId,
                sessions
            });

        } catch (err) {
            return res.status(err.status || 500).json({
                error: err.message
            });
        }
    }
};
