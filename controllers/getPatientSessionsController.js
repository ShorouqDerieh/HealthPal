const PatientSessionsModel = require('../models/getPatientSessionsModel.js');
const UserModel = require('../models/users.js');

module.exports = {
    async getByPatient(req, res) {
        try {
            const patientId = req.params.id;

            // check if user exists
            if (!await UserModel.exists(patientId))
                return res.status(404).json({ error: "Patient not found" });

            // fetch sessions
            const sessions = await PatientSessionsModel.getSessionsByPatient(patientId);

            return res.status(200).json({
                patient_id: patientId,
                sessions
            });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
};
