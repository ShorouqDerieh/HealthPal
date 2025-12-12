const MembersModel = require('../repositories/supportGroupMembers.js');
const UserModel = require('../repositories/users.js');

async function add(req, res) {
    try {
        const { group_id, user_id } = req.body;

        if (!group_id || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!await UserModel.exists(user_id)) {
            return res.status(404).json({ error: "User does not exist" });
        }

        if (!await MembersModel.patientExists(user_id)) {
            return res.status(400).json({ error: "User is not a patient" });
        }

        if (!await MembersModel.groupExists(group_id)) {
            return res.status(404).json({ error: "Group does not exist" });
        }

        if (await MembersModel.isMember(group_id, user_id)) {
            return res.status(400).json({ error: "User is already in this group" });
        }

        const result = await MembersModel.addMember({ group_id, user_id });

        return res.status(201).json({
            message: "Member added to group",
            member_id: result.insertId
        });

    } catch (err) {
        return res.status(500).json({ error: err.message }); // ← تم تصحيحها
    }
}

module.exports = { add };
