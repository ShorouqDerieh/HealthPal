const express=require('express')
const controller=require('../controllers/shortageAlertsController')
const auth=require('../middleware/auth')
const router=express.Router()
router.get('/', auth.authRequired, controller.getOpenForMyOrg);
router.patch('/:id/resolve', auth.authRequired,auth.requireRole('admin', 'ngo_staff'), controller.resolve);
module.exports = router;
