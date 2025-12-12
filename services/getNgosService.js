// services/getNgosService.js
const NgoModel = require('../repositories/getNgosModel.js');
async function getAll() {
    const ngos = await NgoModel.getAll();
    return ngos;
}
module.exports = {
    getAll
};
