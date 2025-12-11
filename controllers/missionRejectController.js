const Model = require('../repositories/missionRejectModel.js');
async function reject(req, res) {
    try {
        const { registration_id } = req.body;

        if (!registration_id) {
            return res.status(400).json({ error: "Missing registration_id" });
        }
        const reg = await Model.registrationExists(registration_id);

        if (!reg) {
            return res.status(404).json({ error: "Registration not found" });
        }

        if (reg.status === "REJECTED") {
            return res.status(400).json({ error: "Registration already rejected" });
        }

        if (reg.status === "APPROVED") {
            return res.status(400).json({ error: "Cannot reject an approved registration" });
        }
        const updated = await Model.reject(registration_id);

        if (!updated) {
            return res.status(500).json({ error: "Failed to reject registration" });
        }

        return res.status(200).json({
            message: "Registration rejected successfully",
            registration_id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { reject };
