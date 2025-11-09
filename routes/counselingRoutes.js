
const express = require('express');
const router = express.Router();
const counselingController = require('../controllers/counselingController');

router.get('/', counselingController.getAllSessions);
router.get('/:id', counselingController.getSessionById);
router.post('/', counselingController.createSession);
router.put('/:id', counselingController.updateSession);
router.delete('/:id', counselingController.deleteSession);

module.exports = router;
