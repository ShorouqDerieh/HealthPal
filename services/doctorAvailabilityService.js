// services/doctorAvailabilityService.js
const AvailabilityModel = require('../repositories/doctorAvailability.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');
async function add(doctor_user_id, starts_at, ends_at, timezone) {

    if (!doctor_user_id || !starts_at || !ends_at || !timezone) {
        throw { status: 400, message: "Missing required fields" };
    }

    if (!await UserModel.exists(doctor_user_id) || !await DoctorModel.isDoctor(doctor_user_id)) {
        throw { status: 404, message: "Doctor not found" };
    }
    if (new Date(ends_at) <= new Date(starts_at)) {
        throw { status: 400, message: "Invalid time range" };
    }

    const id = await AvailabilityModel.createAvailability(
        doctor_user_id,
        starts_at,
        ends_at,
        timezone
    );

    return id;
}
module.exports = {
    add
};
