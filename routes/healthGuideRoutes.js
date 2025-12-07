const express=require('express')
const controller=require('../controllers/healthGuideController')
const auth=require('../middleware/auth')
const router=express.Router()
router.get('/',controller.getAllGuides)
router.post('/',auth.authRequired,auth.requireRole('admin', 'doctor'),controller.createGuide);
router.patch('/:id',auth.authRequired,auth.requireRole('admin', 'doctor'),controller.editGuide)
router.get('/:id', controller.getGuideById);
router.delete('/:id',auth.authRequired,auth.requireRole('admin', 'doctor'),controller.deleteGuide)
module.exports=router