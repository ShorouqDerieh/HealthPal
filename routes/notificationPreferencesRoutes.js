const express=require('express')
const controller=require('../controllers/notificationPreferencesontroller')
const auth=require('../middleware/auth')
const router=express.Router()
router.get('/me', auth.authRequired,controller.getMyPreferences)
router.patch('/me',auth.authRequired,controller.updateMyPreferences
);
module.exports=router