const express=require('express')
const controller=require('../controllers/catalogController')
const router=express.Router()
router.get("/",controller.viewAllListings)
router.get("/:id",controller.ViewOneItem)
module.exports=router