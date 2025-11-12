const express=require('express')
const controller=require('../controllers/requestController')
const auth=require('../middleware/auth')
//const { validate } = require("../utils/fv");
//const { createRequestSchema } = require("../validators/requests");
const router=express.Router()
//const requestController=require('../controllers/requestController')////////
router.post('/',auth.authRequired,controller.createRequest)
router.get('/:id',controller.viewRequest)
router.get("/",controller.viewAllRequests)





module.exports=router