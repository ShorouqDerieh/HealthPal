const JoinModel = require('../repositories/joinRequestsModel.js');
const UserModel = require('../repositories/users.js');
//const GroupsModel = require('../models/supportGroupsModel.js');
const GroupsModel = require('../repositories/supportGroupMembersModel.js');

async function requestJoin(req, res) {
    try {
        const { group_id, user_id } = req.body;

        if (!group_id || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!await UserModel.exists(user_id)) {
            return res.status(404).json({ error: "User does not exist" });
        }

        if (!await GroupsModel.groupExists(group_id)) {
            return res.status(404).json({ error: "Group does not exist" });
        }

        if (await JoinModel.isMember(group_id, user_id)) {
            return res.status(400).json({ error: "User is already a member" });
        }

        if (await JoinModel.requestExists(group_id, user_id)) {
            return res.status(400).json({ error: "Request already pending" });
        }

        const result = await JoinModel.createRequest(group_id, user_id);

        return res.status(201).json({
            message: "Join request submitted",
            request_id: result.insertId
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { requestJoin };
