const express=require ("express");
const router =express.Router();

const {authRequired,requireRole}=require('../../middleware/auth.js');
const doctorCtrl =require('../../controllers/Feature 1.1/doctorsController.js');
router.get("/", doctorCtrl.searchDoctors);
router.get('/:id/availability/',doctorCtrl.getAvailability);
router.post('/:id/availability/', authRequired,                
  requireRole("doctor"),    
  doctorCtrl.addAvailability);

module.exports=router;