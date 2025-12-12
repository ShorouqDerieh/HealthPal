// services/createNgoService.js
const NgoModel = require('../repositories/ngosModel.js');

async function create(name, description, country) {

    if (!name) {
        throw { status: 400, message: "NGO name is required" };
    }

    const ngoId = await NgoModel.createNgo({
        name,
        description,
        country
    });

    return ngoId;
}

module.exports = {
    create
};
