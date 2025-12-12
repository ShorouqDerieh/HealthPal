// controllers/updateNgoController.js
const UpdateNgoService = require('../services/updateNgoService.js');

async function update(req, res) {
    try {
        const ngoId = req.params.id;
        const { name, description, country } = req.body;

        const affectedRows = await UpdateNgoService.update(
            ngoId,
            name,
            description,
            country
        );

        return res.status(200).json({
            message: "NGO updated successfully",
            affected_rows: affectedRows
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}

module.exports = { update };
