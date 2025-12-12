// controllers/removeGroupMemberController.js
const RemoveGroupMemberService = require('../services/removeGroupMemberService.js');
async function remove(req, res) {
    try {
        const { group_id, user_id } = req.body;

        const result = await RemoveGroupMemberService.remove(
            group_id,
            user_id
        );

        return res.status(200).json({
            message: "Member removed successfully",
            group_id: result.group_id,
            user_id: result.user_id
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
