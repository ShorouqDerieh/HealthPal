// controllers/updateSupportGroupController.js
const UpdateSupportGroupService = require('../services/updateSupportGroupService.js');
async function update(req, res) {
    try {
        const groupId = req.params.id;
        const { name, description, category } = req.body;

        const updatedGroupId = await UpdateSupportGroupService.update(
            groupId,
            name,
            description,
            category
        );

        return res.status(200).json({
            message: "Group updated successfully",
            group_id: updatedGroupId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}

module.exports = {
    update
};
