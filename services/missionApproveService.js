// services/missionApproveService.js
const Model = require('../repositories/missionApproveModel.js');

async function approve(registration_id) {

    if (!registration_id) {
        throw { status: 400, message: "Missing registration_id" };
    }

    const reg = await Model.registrationExists(registration_id);
    if (!reg) {
        throw { status: 404, message: "Registration not found" };
    }

    // prevent approving invalid states
    if (reg.status === "APPROVED") {
        throw { status: 400, message: "Already approved" };
    }

    if (reg.status === "REJECTED") {
        throw { status: 400, message: "Cannot approve a rejected registration" };
    }

    // check mission capacity
    if (reg.approved_count >= reg.max_patients) {
        throw { status: 400, message: "Mission is full" };
    }

    // approve
    const updated = await Model.approve(registration_id);
    if (!updated) {
        throw { status: 500, message: "Failed to approve registration" };
    }

    return registration_id;
}
module.exports = {
    approve
};
