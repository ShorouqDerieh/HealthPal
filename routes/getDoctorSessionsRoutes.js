const express = require('express');
const router = express.Router();

const controller = require('../controllers/getDoctorSessionsController.js');

router.get('/:id', controller.getByDoctor);

module.exports = router;
