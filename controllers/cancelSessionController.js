// controllers/cancelSessionController.js
const CancelSessionService = require('../services/cancelSessionService');
module.exports = {

    async cancel(req, res) {
        try {
            const sessionId = req.params.id;

            const cancelledId = await CancelSessionService.cancel(sessionId);

            return res.status(200).json({
                message: "Session cancelled successfully",
                session_id: cancelledId
            });

        } catch (err) {
            return res.status(err.status || 500).json({
                error: err.message
            });
        }
    }

};
