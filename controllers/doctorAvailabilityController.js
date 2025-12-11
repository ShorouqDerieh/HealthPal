const AvailabilityModel = require('../repositories/doctorAvailability.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');

async function add(req, res) {
    try {
        const { doctor_user_id, starts_at, ends_at, timezone } = req.body;

        if (!doctor_user_id || !starts_at || !ends_at || !timezone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!await UserModel.exists(doctor_user_id) || !await DoctorModel.isDoctor(doctor_user_id)) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        if (new Date(ends_at) <= new Date(starts_at)) {
            return res.status(400).json({ error: "Invalid time range" });
        }
        const id = await AvailabilityModel.createAvailability(
            doctor_user_id,
            starts_at,
            ends_at,
            timezone
        );

        return res.status(201).json({
            message: "Availability added successfully",
            availability_id: id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { add };
