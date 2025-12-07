const express=require('express')
const controller=require('../controllers/deliveryController')
const auth=require('../middleware/auth')
const router=express.Router()
router.post('/',auth.authRequired,auth.requireRole('admin', 'ngo_staff'),controller.scheduleDelivery)
  router.patch('/:id/status',auth.authRequired, auth.requireRole('volunteer'),controller.changeDeliveryStatus)
  router.patch('/:id/proof',auth.authRequired,auth.requireRole('volunteer', 'admin', 'ngo_staff'),controller.addProofFile
);
router.get('/my',auth.authRequired,auth.requireRole('volunteer'),controller.getMyDeliveres
);
router.patch(
  '/:id/cancel',
  auth.authRequired,
  auth.requireRole('volunteer', 'admin', 'ngo_staff'),controller.cancelDelivery
);

  module.exports=router;