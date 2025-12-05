
const CounselingModel = require('../models/counselingModel.js');
const UserModel = require('../models/users.js');
const DoctorModel = require('../models/doctor.js');
const PatientModel = require('../models/patient.js');
const { encrypt } = require('../utils/encryption');

module.exports = {

    async create(req, res) {
        try {
            const { counselor_id, patient_id, starts_at, ends_at, notes } = req.body;

            //Basic validation 
            if (!counselor_id || !patient_id || !starts_at || !ends_at) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            // check if users exist
            if (!await UserModel.exists(counselor_id))
                return res.status(404).json({ error: "Counselor user doesn't exist" });

            if (!await UserModel.exists(patient_id))
                return res.status(404).json({ error: "Patient user doesn't exist" });

       // check roles
            if (!await DoctorModel.isDoctor(counselor_id))
                return res.status(400).json({ error: "Counselor must be a doctor" });

            if (!await PatientModel.isPatient(patient_id))
                return res.status(400).json({ error: "Patient must have a patient profile" });

            //encrypt notes 
            const encryptedNotes = notes ? encrypt(notes) : null;

            // insert session
            const result = await CounselingModel.createSession({
                counselor_id,
                patient_id,
                starts_at,
                ends_at,
                notes: encryptedNotes
            });

            return res.status(201).json({
                message: "Counseling session created",
                session_id: result.insertId
            });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

};
