// controllers/getDoctorAvailabilityController.js
const GetDoctorAvailabilityService = require('../services/getDoctorAvailabilityService.js');
async function getAll(req, res) {
    try {
        const doctor_user_id = req.params.doctor_user_id;

        const availability = await GetDoctorAvailabilityService.getAll(
            doctor_user_id
        );

        return res.status(200).json({
            doctor_user_id,
            availability
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { getAll };
