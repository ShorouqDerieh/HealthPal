const express = require('express');
const router = express.Router();
const controller = require('../controllers/getMissionPatientsController.js');
router.get('/:mission_id/patients', controller.list);
module.exports = router;
