// services/deleteSupportGroupService.js
const GroupsModel = require('../repositories/deleteSupportGroup.js');
async function remove(groupId) {

    // if group exists
    const group = await GroupsModel.getGroupById(groupId);
    if (!group) {
        throw { status: 404, message: "Group not found" };
    }
    // delete
    await GroupsModel.deleteGroup(groupId);

    return groupId;
}
module.exports = {
    remove
};
