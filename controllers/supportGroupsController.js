const GroupsModel = require('../models/supportGroupsModel.js');
const UserModel = require('../models/users.js');

async function create(req, res) {
    try {
        const { name, description, category, created_by_user_id } = req.body;

     
        if (!name || !created_by_user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!await UserModel.exists(created_by_user_id)) {
            return res.status(404).json({ error: "Creator user not found" });
        }

  
        const result = await GroupsModel.createGroup({
            name,
            description,
            category,
           created_by_user_id,
           created_at: new Date()
        });

        return res.status(201).json({
            message: "Support group created successfully",
            group_id: result.insertId
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    create
};
