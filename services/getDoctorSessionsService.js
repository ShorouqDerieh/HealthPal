// services/getDoctorSessionsService.js
const DoctorSessionsModel = require('../repositories/getDoctorSessions.js');
const UserModel = require('../repositories/users.js');
const DoctorModel = require('../repositories/doctor.js');
async function getByDoctor(doctorId) {

    if (!await UserModel.exists(doctorId))
        throw { status: 404, message: "User not found" };

    if (!await DoctorModel.isDoctor(doctorId))
        throw { status: 400, message: "User is not a doctor" };

    const sessions = await DoctorSessionsModel.getSessionsByDoctor(doctorId);

    return sessions;
}
module.exports = {
    getByDoctor
};
