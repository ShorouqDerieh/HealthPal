const express=require('express')
const controller=require('../controllers/catalogController')
const router=express.Router()
router.get("/",controller.viewAllListings)
module.exports=router