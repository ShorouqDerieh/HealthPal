// controllers/doctorAvailabilityController.js
const DoctorAvailabilityService = require('../services/doctorAvailabilityService.js');
async function add(req, res) {
    try {
        const { doctor_user_id, starts_at, ends_at, timezone } = req.body;

        const availabilityId = await DoctorAvailabilityService.add(
            doctor_user_id,
            starts_at,
            ends_at,
            timezone
        );

        return res.status(201).json({
            message: "Availability added successfully",
            availability_id: availabilityId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { add };
