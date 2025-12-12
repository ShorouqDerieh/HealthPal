// controllers/createSupportGroupController.js
const CreateSupportGroupService = require('../services/createSupportGroupService.js');

async function create(req, res) {
    try {
        const { name, description, category, created_by_user_id } = req.body;

        const groupId = await CreateSupportGroupService.create(
            name,
            description,
            category,
            created_by_user_id
        );

        return res.status(201).json({
            message: "Support group created successfully",
            group_id: groupId
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
