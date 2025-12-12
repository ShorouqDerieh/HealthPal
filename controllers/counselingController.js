// controllers/counselingController.js
const CounselingService = require('../services/counselingService.js');

module.exports = {

    async create(req, res) {
        try {
            const { counselor_id, patient_id, starts_at, ends_at, notes } = req.body;

            const sessionId = await CounselingService.create(
                counselor_id,
                patient_id,
                starts_at,
                ends_at,
                notes
            );

            return res.status(201).json({
                message: "Counseling session created",
                session_id: sessionId
            });

        } catch (err) {
            return res.status(err.status || 500).json({
                error: err.message
            });
        }
    }

};
