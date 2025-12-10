const NgoModel = require('../repositories/getNgosModel.js');
async function getAll(req, res) {
    try {
        const ngos = await NgoModel.getAll();
        return res.status(200).json(ngos);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
module.exports = { getAll };
