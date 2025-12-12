const express=require('express')
const controller=require('../controllers/webinarsController')
const auth=require('../middleware/auth')
const router=express.Router()
router.get('/',controller.allWebinars)
router.get('/my',auth.authRequired,controller.getMyWebinars)
router.get('/:id/attendees',auth.authRequired,auth.requireRole('admin','ngo','doctor'),controller.getWebinarAttendees);
router.get('/:id',controller.showOneWebinar)
router.post('/',auth.authRequired,auth.requireRole('admin','doctor','ngo'),controller.createWebinar)
router.patch('/:id',auth.authRequired,auth.requireRole('admin','doctor','ngo'),controller.updateWebinar)
router.delete('/:id',auth.authRequired,auth.requireRole('admin','doctor','ngo'),controller.deleteWebinar)
router.post('/:id/register',auth.authRequired,auth.requireRole('patient','donor'),controller.registerForWebinar);
router.delete('/:id/register',auth.authRequired,auth.requireRole('patient','donor'),controller.cancelRegistration);
module.exports=router