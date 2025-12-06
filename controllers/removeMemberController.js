const MembersModel = require('../models/removeMemberModel.js');
async function remove(req, res) {
    try {
        const { group_id, user_id } = req.body;

        if (!group_id || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!await MembersModel.isMember(group_id, user_id)) {
            return res.status(404).json({ error: "User is not a member of this group" });
        }
        await MembersModel.removeMember(group_id, user_id);
        return res.status(200).json({
            message: "Member removed successfully",
            group_id,
            user_id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = {
    remove
};
