// controllers/getNgosController.js
const GetNgosService = require('../services/getNgosService.js');
async function getAll(req, res) {
    try {
        const ngos = await GetNgosService.getAll();

        return res.status(200).json(ngos);

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
module.exports = { getAll };
