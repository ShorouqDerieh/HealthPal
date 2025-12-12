// services/updateSupportGroupService.js
const GroupsModel = require('../repositories/updateSupportGroup.js');
async function update(groupId, name, description, category) {

    if (!name) {
        throw { status: 400, message: "Group name is required" };
    }

    const existing = await GroupsModel.getGroupById(groupId);
    if (!existing) {
        throw { status: 404, message: "Group not found" };
    }

    await GroupsModel.updateGroup(groupId, {
        name,
        description,
        category
    });

    return groupId;
}

module.exports = {
    update
};
