const NgoModel = require('../repositories/updateNgo.js');
async function update(req, res) {
    try {
        const ngoId = req.params.id;
        const { name, description, country } = req.body;

        if (!name || !description || !country) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (!await NgoModel.ngoExists(ngoId)) {
            return res.status(404).json({ error: "NGO not found" });
        }

        const result = await NgoModel.updateNgo(ngoId, {
            name,
            description,
            country
        });
        return res.status(200).json({
            message: "NGO updated successfully",
            affected_rows: result.affectedRows
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { update };
