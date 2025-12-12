// services/updateNgoService.js
const NgoModel = require('../repositories/updateNgoModel.js');

async function update(ngoId, name, description, country) {

    if (!name || !description || !country) {
        throw { status: 400, message: "Missing required fields" };
    }

    if (!await NgoModel.ngoExists(ngoId)) {
        throw { status: 404, message: "NGO not found" };
    }

    const result = await NgoModel.updateNgo(ngoId, {
        name,
        description,
        country
    });

    return result.affectedRows;
}

module.exports = {
    update
};
