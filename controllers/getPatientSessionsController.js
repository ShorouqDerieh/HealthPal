const PatientSessionsModel = require('../repositories/getPatientSessions.js');
const UserModel = require('../repositories/users.js');

module.exports = {
    async getByPatient(req, res) {
        try {
            const patientId = req.params.id;

            if (!await UserModel.exists(patientId))
                return res.status(404).json({ error: "Patient not found" });

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
