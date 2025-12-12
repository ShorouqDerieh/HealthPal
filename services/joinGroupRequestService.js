// services/joinGroupRequestService.js
const JoinModel = require('../repositories/joinRequestsModel.js');
const UserModel = require('../repositories/users.js');
const GroupsModel = require('../repositories/supportGroupMembersModel.js');
async function requestJoin(group_id, user_id) {

    if (!group_id || !user_id) {
        throw { status: 400, message: "Missing required fields" };
    }

    if (!await UserModel.exists(user_id)) {
        throw { status: 404, message: "User does not exist" };
    }

    if (!await GroupsModel.groupExists(group_id)) {
        throw { status: 404, message: "Group does not exist" };
    }

    if (await JoinModel.isMember(group_id, user_id)) {
        throw { status: 400, message: "User is already a member" };
    }

    if (await JoinModel.requestExists(group_id, user_id)) {
        throw { status: 400, message: "Request already pending" };
    }

    const result = await JoinModel.createRequest(group_id, user_id);

    return result.insertId;
}
module.exports = {
    requestJoin
};
