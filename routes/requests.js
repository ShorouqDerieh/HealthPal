const express=require('express')
const controller=require('../controllers/requestController')
const router=express.Router()
const requestController=require('../controllers/requestController')////////
router.post('/',controller.createRequest)
router.get('/:id',controller.viewRequest)





module.exports=router