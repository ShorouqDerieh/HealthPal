const Model = require('../repositories/missionApproveModel.js');
async function approve(req, res) {
    try {
        const { registration_id } = req.body;
        if (!registration_id) {
            return res.status(400).json({ error: "Missing registration_id" });
        }
        const reg = await Model.registrationExists(registration_id);

        if (!reg) {
            return res.status(404).json({ error: "Registration not found" });
        }
        // prevent approving invalid states
        if (reg.status === "APPROVED") {
            return res.status(400).json({ error: "Already approved" });
        }

        if (reg.status === "REJECTED") {
            return res.status(400).json({ error: "Cannot approve a rejected registration" });
        }
        // check mission capacity
        if (reg.approved_count >= reg.max_patients) {
            return res.status(400).json({ error: "Mission is full" });
        }
        // approve
        const updated = await Model.approve(registration_id);

        if (!updated) {
            return res.status(500).json({ error: "Failed to approve registration" });
        }

        return res.status(200).json({
            message: "Registration approved successfully",
            registration_id
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { approve };
