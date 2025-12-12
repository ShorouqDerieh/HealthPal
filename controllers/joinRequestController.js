// controllers/joinGroupRequestController.js
const JoinGroupRequestService = require('../services/joinGroupRequestService.js');

async function requestJoin(req, res) {
    try {
        const { group_id, user_id } = req.body;

        const requestId = await JoinGroupRequestService.requestJoin(
            group_id,
            user_id
        );

        return res.status(201).json({
            message: "Join request submitted",
            request_id: requestId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}

module.exports = { requestJoin };
