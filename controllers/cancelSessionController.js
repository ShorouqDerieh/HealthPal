
const CancelModel = require('../repositories/cancelSessionModel');

module.exports = {

    async cancel(req, res) {
        try {
            const sessionId = req.params.id;

            const rows = await CancelModel.findSessionById(sessionId);

            if (rows.length === 0)
                return res.status(404).json({ error: "Session not found!" });

            if (rows[0].status === "CANCELLED")
                return res.status(400).json({ error: "Session already cancelled" });

            await CancelModel.cancel(sessionId);

            return res.status(200).json({
                message: "Session cancelled successfully",
                session_id: sessionId
            });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

};
