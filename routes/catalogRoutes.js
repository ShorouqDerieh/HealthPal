const express=require('express')
const controller=require('../controllers/catalogController')
const auth=require('../middleware/auth')
const router=express.Router()
router.get("/",controller.viewAllListings)
router.get("/:id",controller.ViewOneItem)
router.post("/items",auth.authRequired,auth.requireRole("doctor","admin","ngo_staff"),controller.addNewItem)
module.exports=router