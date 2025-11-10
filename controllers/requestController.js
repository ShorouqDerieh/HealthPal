const model=require('../models/requestModel')
exports.createRequest=async (req,res)=>
{
  try{
    const request={
     //   id:req.body.id,
    requester_user_id: req.body.requester_user_id,
    type: req.body.type,
    name: req.body.name,
    dosage_or_specs: req.body.dosage_or_specs,
   urgency: req.body.urgency,
   quantity:req.body.quantity,
    unit: req.body.unit,
    location_geo: req.body.location_geo,
    notes:req.body.notes
    }
  
    const id = await model.addRequest(request);
  return res.status(201).json({
      message: "Request created successfully",
      id,
      request
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.viewRequest=async (req,res)=>
{
  try{
  
    const request= await model.showRequest(req.params.id)
  if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.viewAllRequests=async(req,res)=>{
  try{
    const request= await model.showAllRequests()
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  }