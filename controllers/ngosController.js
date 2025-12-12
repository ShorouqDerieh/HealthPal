const NgoModel = require('../repositories/ngos.js');
async function create(req, res) {
    try {
        const { name, description, country } = req.body;
        if (!name) {
            return res.status(400).json({ error: "NGO name is required" });
        }
        const ngoId = await NgoModel.createNgo({
            name,
            description,
            country
        });
        return res.status(201).json({
            message: "NGO created successfully",
            ngo_id: ngoId
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = {
    create
};

