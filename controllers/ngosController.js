// controllers/createNgoController.js
const CreateNgoService = require('../services/createNgoService.js');

async function create(req, res) {
    try {
        const { name, description, country } = req.body;

        const ngoId = await CreateNgoService.create(
            name,
            description,
            country
        );

        return res.status(201).json({
            message: "NGO created successfully",
            ngo_id: ngoId
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}
module.exports = {
    create
};
