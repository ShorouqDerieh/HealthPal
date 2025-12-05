const express=require('express')
const controller=require('../controllers/matchController')
const auth=require('../middleware/auth')
const router=express.Router()
router.post("/:requestId/:listingId",auth.authRequired,auth.requireRole('admin', 'ngo_staff'),controller.createMatch)
module.exports=router