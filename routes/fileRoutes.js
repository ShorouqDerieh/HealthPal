const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/fileController');
const auth = require('../middleware/auth');
router.post(
  '/upload',
  auth.authRequired,
  upload.single('file'),
  controller.upload
);

module.exports = router;
