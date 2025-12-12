// services/addGroupMemberService.js
const MembersModel = require('../repositories/supportGroupMembersModel.js');
const UserModel = require('../repositories/users.js');

async function add(group_id, user_id) {

    if (!group_id || !user_id) {
        throw { status: 400, message: "Missing required fields" };
    }

    if (!await UserModel.exists(user_id)) {
        throw { status: 404, message: "User does not exist" };
    }

    if (!await MembersModel.patientExists(user_id)) {
        throw { status: 400, message: "User is not a patient" };
    }

    if (!await MembersModel.groupExists(group_id)) {
        throw { status: 404, message: "Group does not exist" };
    }

    if (await MembersModel.isMember(group_id, user_id)) {
        throw { status: 400, message: "User is already in this group" };
    }

    const result = await MembersModel.addMember({ group_id, user_id });

    return result.insertId;
}

module.exports = {
    add
};
