const AppointmentsModel = require('../repositories/getPatientAppointmentsModel.js');
const UserModel = require('../repositories/users.js');
async function getAll(req, res) {
    try {
        const patient_user_id = req.params.patient_user_id;
        if (!patient_user_id) {
            return res.status(400).json({ error: "Missing patient_user_id" });
        }
        // check patient exists
        if (!await UserModel.exists(patient_user_id)) {
            return res.status(404).json({ error: "Patient not found" });
        }
        const appointments = await AppointmentsModel.getByPatient(patient_user_id);
        return res.status(200).json({
            patient_user_id,
            appointments
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { getAll };
