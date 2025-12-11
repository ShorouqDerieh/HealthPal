const express=require('express')
const controller=require('../controllers/alertController')
const auth=require('../middleware/auth')
const router=express.Router()
router.post('/admin',auth.authRequired,auth.requireRole('admin'),controller.CreateAlert)
router.get('/',controller.showAllAlerts)
router.get('/admin',auth.authRequired,auth.requireRole('admin'),controller.showAdminAlerts)
router.patch('/admin/:id',auth.authRequired,auth.requireRole('admin'),controller.updateAlert);
router.get('/unread', auth.authRequired, controller.getUnreadAlerts);
router.get('/:id', controller.getPublicAlertById);
router.get('/admin/:id',auth.authRequired,auth.requireRole('admin'),controller.getAdminAlertById)
router.post('/:id/read',auth.authRequired,controller.markAlertAsRead);
 module.exports=router;