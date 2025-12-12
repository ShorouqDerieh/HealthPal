// controllers/createSurgicalMissionController.js
const CreateSurgicalMissionService = require('../services/createSurgicalMissionService.js');

async function create(req, res) {
    try {
        const { title, location, date, speciality, max_patients, description } = req.body;

        const mission_id = await CreateSurgicalMissionService.create(
            title,
            location,
            date,
            speciality,
            max_patients,
            description
        );

        return res.status(201).json({
            message: "Surgical mission created successfully",
            mission_id
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            error: err.message
        });
    }
}

module.exports = { create };
