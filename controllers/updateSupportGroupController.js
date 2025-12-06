const GroupsModel = require('../models/updateSupportGroupModel.js');
async function update(req, res) {
    try {
        const groupId = req.params.id;
        const { name, description, category } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Group name is required" });
        }

        const existing = await GroupsModel.getGroupById(groupId);
        if (!existing) {
            return res.status(404).json({ error: "Group not found" });
        }

        await GroupsModel.updateGroup(groupId, {
            name,
            description,
            category
        });

        return res.status(200).json({
            message: "Group updated successfully",
            group_id: groupId
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = {
    update
};
