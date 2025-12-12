// services/counselingService.js
const CounselingModel = require('../repositories/counselingModel.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');
const PatientModel = require('../repositories/patient.js');
const { encrypt } = require('../utils/encryption');
async function create(counselor_id, patient_id, starts_at, ends_at, notes) {
    //basic validation 
    if (!counselor_id || !patient_id || !starts_at || !ends_at) {
        throw { status: 400, message: "Missing required fields" };
    }

    // check if users exist
    if (!await UserModel.exists(counselor_id))
        throw { status: 404, message: "Counselor user doesn't exist" };

    if (!await UserModel.exists(patient_id))
        throw { status: 404, message: "Patient user doesn't exist" };

    // check roles
    if (!await DoctorModel.isDoctor(counselor_id))
        throw { status: 400, message: "Counselor must be a doctor" };

    if (!await PatientModel.isPatient(patient_id))
        throw { status: 400, message: "Patient must have a patient profile" };

    // encrypt notes 
    const encryptedNotes = notes ? encrypt(notes) : null;

    // insert session
    const result = await CounselingModel.createSession({
        counselor_id,
        patient_id,
        starts_at,
        ends_at,
        notes: encryptedNotes
    });

    return result.insertId;
}
module.exports = {
    create
};
