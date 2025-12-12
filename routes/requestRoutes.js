const express=require('express')
const controller=require('../controllers/requestController')
const auth=require('../middleware/auth')
//const { validate } = require("../utils/fv");
//const { createRequestSchema } = require("../validators/requests");
const router=express.Router()
//const requestController=require('../controllers/requestController')////////
router.post('/',auth.authRequired,controller.createRequest)
router.get('/:id',auth.authRequired,controller.viewRequest)
router.get("/",auth.authRequired,auth.requireRole("admin", "ngo_staff"),controller.viewAllRequests)
router.get('/my/requests',auth.authRequired,controller.viewMyRequests);
router.patch('/:id/status',auth.authRequired,auth.requireRole("admin","ngo_staff"),controller.UpdateStatus)
module.exports=router