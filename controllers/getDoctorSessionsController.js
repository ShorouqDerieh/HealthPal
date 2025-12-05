const DoctorSessionsModel = require('../models/getDoctorSessionsModel.js');
const UserModel = require('../models/users.js');
const DoctorModel = require('../models/doctor.js');

module.exports = {
    async getByDoctor(req, res) {
        try {
            const doctorId = req.params.id;
            if (!await UserModel.exists(doctorId))
                return res.status(404).json({ error: "User not found" });

            if (!await DoctorModel.isDoctor(doctorId))
                return res.status(400).json({ error: "User is not a doctor" });

            const sessions = await DoctorSessionsModel.getSessionsByDoctor(doctorId);

            return res.status(200).json({
                doctor_id: doctorId,
                sessions
            });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
};
