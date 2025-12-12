const GroupsModel = require('../repositories/supportGroups.js');
const UserModel = require('../repositories/users.js');
async function create(name, description, category, created_by_user_id) {

    if (!name || !created_by_user_id) {
        throw { status: 400, message: "Missing required fields" };
    }

    if (!await UserModel.exists(created_by_user_id)) {
        throw { status: 404, message: "Creator user not found" };
    }
    const result = await GroupsModel.createGroup({
        name,
        description,
        category,
        created_by_user_id,
        created_at: new Date()
    });

    return result.insertId;
}
module.exports = {
    create
};
