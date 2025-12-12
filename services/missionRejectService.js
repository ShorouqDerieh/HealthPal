// services/missionRejectService.js
const Model = require('../repositories/missionRejectModel.js');

async function reject(registration_id) {

    if (!registration_id) {
        throw { status: 400, message: "Missing registration_id" };
    }

    const reg = await Model.registrationExists(registration_id);
    if (!reg) {
        throw { status: 404, message: "Registration not found" };
    }

    if (reg.status === "REJECTED") {
        throw { status: 400, message: "Registration already rejected" };
    }

    if (reg.status === "APPROVED") {
        throw { status: 400, message: "Cannot reject an approved registration" };
    }

    const updated = await Model.reject(registration_id);
    if (!updated) {
        throw { status: 500, message: "Failed to reject registration" };
    }

    return registration_id;
}
module.exports = {
    reject
};
