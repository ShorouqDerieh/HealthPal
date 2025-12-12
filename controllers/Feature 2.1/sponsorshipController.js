const SponsorshipRepository =require ("../../repositories/Feature 2.1/SponsorshipRepository");
const SponsorshipService=require("../../services/Feature 2.1/SponsorshipService");
const repository =new SponsorshipRepository();
const service=new SponsorshipService(repository);
async function createTreatment(req,res,next){
    try{
        const {patient_user_id,type,description,provider_org_id}=req.body;
      const treatment =await   service.createTreatmentForPatient({patientUserId:patient_user_id,type,description,providerOrgId:provider_org_id});
      return res.status(201).json(treatment);

    }
catch(err){
    next(err);
}
}
async function createCampaign (req,res,next){
    
    try{
        const { treatment_id, title, goal_amount, currency, story } = req.body;
const campaign=await service.createCampaignForTreatment({ treatmentId:treatment_id, title, goalAmount:goal_amount, currency, story });
return res.status(201).json(campaign);
    }
    catch(err){
        next(err);
    }

}
async function listCampaigns(req,res,next){
    try{
const {type ,limit ,offset} =req.query;

const result= await service.listOpenCampaigns({type:type ||undefined ,limit:limit ?Number(limit):20, offset:offset?Number(offset):0});
return res.json(result);
    }
    catch(err){
        next(err);
    }
}
async function getCampaign(req,res,next){
    try{
const campaignId =Number(req.params.id);
const result = await service.getCampaignDetails(campaignId);
return res.json(result);
    }

    catch(err){
        next(err);
    }
}
async function donate(req,res,next){
    try{
const campaignId=Number(req.params.id);
const {amount,currency,method}=req.body;
const donorUserId=Number(req.user?.id) ||null;
const result =await service.donateToCampaign({campaignId,donorUserId,amount:Number(amount),currency,method});
return res.status(201).json(result);
}
    catch(err){
next(err);
    }
}
module.exports ={donate,getCampaign,listCampaigns,createTreatment,createCampaign};
