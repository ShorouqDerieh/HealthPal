// controllers/deleteSupportGroupController.js
const DeleteSupportGroupService = require('../services/deleteSupportGroupService.js');
async function remove(req, res) {
    try {
        const groupId = req.params.id;

        const deletedId = await DeleteSupportGroupService.remove(groupId);

        return res.status(200).json({
            message: "Group deleted successfully",
            deleted_group_id: deletedId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = {
    remove
};
