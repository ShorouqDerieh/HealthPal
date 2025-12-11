const AvailabilityModel = require('../repositories/getDoctorAvailabilityModel.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');

async function getAll(req, res) {
    try {
        const doctor_user_id = req.params.doctor_user_id;

        if (!doctor_user_id) {
            return res.status(400).json({ error: "Missing doctor_user_id" });
        }

        if (!await UserModel.exists(doctor_user_id) || !await DoctorModel.isDoctor(doctor_user_id)) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const availability = await AvailabilityModel.getByDoctor(doctor_user_id);

        return res.status(200).json({
            doctor_user_id,
            availability
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { getAll };
