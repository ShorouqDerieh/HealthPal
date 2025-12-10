const express = require('express');
const router = express.Router();

const controller = require('../controllers/updateNgoController.js');

// PUT /api/ngos/update/5
router.put('/:id', controller.update);

module.exports = router;
