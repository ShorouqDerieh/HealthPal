// services/removeGroupMemberService.js
const MembersModel = require('../repositories/removeMember.js');

async function remove(group_id, user_id) {

    if (!group_id || !user_id) {
        throw { status: 400, message: "Missing required fields" };
    }

    if (!await MembersModel.isMember(group_id, user_id)) {
        throw { status: 404, message: "User is not a member of this group" };
    }

    await MembersModel.removeMember(group_id, user_id);

    return { group_id, user_id };
}
module.exports = {
    remove
};
