// controllers/addGroupMemberController.js
const AddGroupMemberService = require('../services/addGroupMemberService.js');

async function add(req, res) {
    try {
        const { group_id, user_id } = req.body;

        const memberId = await AddGroupMemberService.add(
            group_id,
            user_id
        );

        return res.status(201).json({
            message: "Member added to group",
            member_id: memberId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = { add };
