const PatientProfileRepository = require('../../repositories/patientProfileRepository');
const PatientProfileService = require('../../services/patientProfileService');
const repository = new PatientProfileRepository();
const service = new PatientProfileService(repository);
async function getMyProfile(req, res, next) {
    try {
        const userId = Number(req.user.id);
        const profile = await service.getMyProfile(userId);
        return res.json(profile);
    } catch (err) {
        next(err);
    }     
}
async function upsertMyProfile(req, res, next) {
    try {
        const userId = Number(req.user.id);
        const profileData = req.body;
        const updatedProfile = await service.upsertMyProfile(userId, profileData);
        return res.status(200).json(updatedProfile);
    } catch (err) {
        next(err);
    }   }
    async function listPublicProfiles(req,res,next){
        try{
           const filters={
            country:req.query.country,
            city:req.query.city 
           }
              const profiles= await service.listPublicProfiles(filters);
                return res.json(profiles);
        }
        catch(err){
            next(err);
        }
    }

    async function getPublicProfiles(req,res,next){
        try{
            const patientUserId= Number (req.params.patientUserId); 
            const profile= await service.getPublicProfiles (patientUserId);
            if(!profile){
                return res.status (404).json({message:'Profile not found or not public'});
            }
            return res.json(profile);
        }
        catch(err){
            next(err);
        }
    }
async function verifyProfile(req,res,next){
try{
    const patientUserId=Number(req.params.patientUserId);
    const verifiedByUserId=Number(req.user.id);
    const updatedProfile= await service.verifyPatientProfile(patientUserId,verifiedByUserId);
    return res.json (updatedProfile);

}
catch(err){
    next(err);

}

}
async function addHistoryRecord(req,res,next){
    const patientUserId=Number(req.params.patientUserId);
    const clinicalUserId= Number (req.user.id);
    
   
  try{ const data= await service.addHistoryRecord(patientUserId,clinicalUserId,
        {
            "title":req.body.title,
            "description":req.body.description,
            "recordDate":req.body.recordDate,
            "hospitalName":req.body.hospitalName,
            "attendingPhysician":req.body.attendingPhysician,
            "isPublic":req.body.isPublic
        });
    return res.status (201).json({data});}
    catch(err){
        next(err);
    }
    
}

async function getFullHistory(req,res,next){
try{
    const patientUserId=Number(req.params.patientUserId);
    const result =await service.getFullHistory(patientUserId);
    return res.json(result);

}
catch(err){
    next(err);
}   }
async function getPublicHistory(req,res,next){
    try{
        const result =await service.getPublicHistory(Number(req.params.patientUserId));
        if(!result){
            return res.status(404).json({message:'No public records found'});
        }
        return res.json(result);

    }
    catch(err){
        next(err);  }
}
async function createDonationGoal(req,res,next){
    try{
        const patientUserId=Number(req.params.patientUserId);
     
        const data= await service.createDonationGoal(patientUserId,{title:req.body.title,description:req.body.description,
        targetAmount:req.body.targetAmount,
        currency:req.body.currency,
        campaignId:req.body.campaignId,
        startDate:req.body.startDate,
        endDate:req.body.endDate});
        return res.status(201).json({data});
    }
    catch(err){
        next(err);
    }
}
async function updateDonationGoal(req,res,next){
    try{
        const patientUserId=Number(req.params.patientUserId);
        const goalId=Number(req.params.goalId);
      
        const updatedGoal= await service.updateDonationGoal(patientUserId,goalId,req.body);
        return res.json(updatedGoal);
    }
    catch(err){
        next(err);
    }   }


    async function getDonationGoals(req,res,next){
    try{
        const patientUserId=Number(req.params.patientUserId);
        const actingUser=req.user;
        const goals= await service.getDonationGoals(patientUserId,actingUser||null);

        return res.json(goals);
    }
    catch(err){
        next(err);
    }   
    }


    async function createRecoveryUpdate(req,res,next){
    try{
        const { title, message, updateDate, isPublic } = req.body;
        const patientUserId=Number(req.params.patientUserId);
        const actingUser=req.user.id;
        const result= await service.createRecoveryUpdate(patientUserId, actingUser,{ title, message, updateDate, isPublic });
        return res.status(201).json(result);
    }       
    catch(err){
        next(err);
    }   }

    async function getRecoveryUpdates(req,res,next){
    try{
        const patientUserId=Number(req.params.patientUserId);
        const actingUser=req.user;  
        const updates= await service.getRecoveryUpdates(patientUserId,actingUser||null);
        return res.json(updates);
    }
    catch(err){
        next(err);
    }
}
module.exports={
    getMyProfile,upsertMyProfile,listPublicProfiles,getPublicProfiles,
    verifyProfile,addHistoryRecord,getFullHistory,getPublicHistory,createDonationGoal,
    updateDonationGoal,getDonationGoals,createRecoveryUpdate,getRecoveryUpdates
};