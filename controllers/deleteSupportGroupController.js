const GroupsModel = require('../repositories/supportGroups.js');

async function remove(req, res) {
    try {
        const groupId = req.params.id;
        //if group exists
        const group = await GroupsModel.getGroupById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        //delete
        const result = await GroupsModel.deleteGroup(groupId);

        return res.status(200).json({
            message: "Group deleted successfully",
            deleted_group_id: groupId
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = {
    remove
};
