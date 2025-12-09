const model=require('../repositories/deliveryRepository')
const matchModel=require('../repositories/matchRepository')
const requestModel=require('../repositories/requestRepository')
const FileModel=require('../repositories/fileRepository')
const catalogModel=require('../repositories/catalogRepository')
exports.scheduleDelivery=async(req,res)=>{
    try{
    const matchId=req.body.match_id
    const volunteerId=req.body.volunteer_user_id
    if (!matchId || !volunteerId) {
      return res.status(400).json({
        message: 'match id and volunteer id are required'
      });
    }
   const existingDelivery = await model.getByMatchId(matchId);
    if (existingDelivery) {
      return res.status(400).json({
        message: 'This match already has a delivery assigned',
        delivery_id: existingDelivery.id
      });
    }
    const delivery = await model.createDelivery(matchId, volunteerId);
        await matchModel.updateStatus(matchId,"ACCEPTED");
     return res.status(201).json({
      message: 'Delivery assigned to volunteer successfully',
      delivery
    });
  } catch (err) {
    console.error('Error in assign delivery to volunteer:', err);
    return res.status(500).json({ error: err.message });
  }
}
exports.changeDeliveryStatus=async(req,res)=>{
  try{
    const allowedStatuses = ['SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const delivery=await model.getDelivery(req.params.id)
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if(req.user.id!=delivery.volunteer_user_id)
    {
       return res.status(403).json({ message: 'You are not assigned to this delivery' });
    }
    const currentStatus=delivery.status;
    const newStatus=req.body.status
    if(currentStatus==='SCHEDULED')
    {
       if (newStatus !== 'IN_TRANSIT') {
        return res.status(400).json({
          message: `From SCHEDULED you can only go to IN_TRANSIT`
        });
      }
  }
  else if (currentStatus === 'IN_TRANSIT') {
      if (newStatus !== 'DELIVERED' && newStatus !== 'FAILED') {
        return res.status(400).json({
          message: `From IN_TRANSIT you can only go to DELIVERED or FAILED`
        });
      }
    }
    else if (currentStatus === 'DELIVERED' || currentStatus === 'FAILED') {
      return res.status(400).json({
        message: `Delivery with status '${currentStatus}' cannot be changed`
      });
    }
    if(req.body.status==='IN_TRANSIT')
    {
      await model.changeDeliveryStatus(req.params.id,'IN_TRANSIT',{PickupTime:true})
       return res.status(200).json({
        message: 'Delivery status updated to IN_TRANSIT'
      });
    }
    if(req.body.status==='DELIVERED')
    {
      const match=await matchModel.getById(delivery.match_id)
       if (!match) {
        return res.status(500).json({ message: 'Match not found for this delivery' });
      }
      const request = await requestModel.showRequest(match.request_id);
      if (!request) {
        return res.status(500).json({ message: 'Request not found for this match' });
      }
      await model.changeDeliveryStatus(req.params.id,'DELIVERED',{DropoffTime:true})
      await matchModel.updateStatus(delivery.match_id,'FULFILLED');
      await requestModel.editRequestStatus(
        match.request_id,
        request.status,       
        'FULFILLED',
        req.user.id,
        'Delivery completed by volunteer'
      );
      return res.status(200).json({
        message: 'Delivery marked as DELIVERED and request fulfilled'
      });
    }
     if (newStatus === 'FAILED') {
      await model.updateStatusWithTimestamps(
        req.params.id,
        'FAILED',
        { DropoffTime:true}
      );
      return res.status(200).json({
        message: 'Delivery marked as FAILED'
      });
    }

}
  catch(err){
     console.error('Error in updateDeliveryStatus:', err);
    return res.status(500).json({ error: err.message });
  }
}
exports.addProofFile=async(req,res)=>{
  try{
    const deliveryId = req.params.id;
    const userId = req.user.id;
    const userRoles = req.user.roles || [];

    if (!req.body.proof_file_id) {
      return res.status(400).json({ message: 'proof_file_id is required' });
    }
    const delivery = await model.getDelivery(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    const file = await FileModel.getFileById(req.body.proof_file_id);
    if (!file) {
      return res.status(400).json({ message: 'File not found for given proof_file_id' });
    }
    const isOwnerVolunteer = delivery.volunteer_user_id === userId;
    const isAdminOrNgo =
      userRoles.includes('admin') || userRoles.includes('ngo_staff');
    if (!isOwnerVolunteer && !isAdminOrNgo) {
      return res.status(403).json({
        message: 'You are not allowed to attach proof to this delivery'
      });
    }
    const updated = await model.addProof(deliveryId, req.body.proof_file_id);
    if (!updated) {
      return res.status(500).json({ message: 'Failed to attach proof to delivery' });
    }
    return res.status(200).json({
      message: 'Proof attached to delivery successfully',
      delivery_id: deliveryId
    });
  }
  catch(err){
     console.error('Error in attachProof:', err);
    return res.status(500).json({ error: err.message });
  }
}
exports.getMyDeliveres=async(req,res)=>
{
try{
  const deliveries = await model.getDeliveryForVolunteer(req.user.id);
   if (deliveries.length === 0) {
      return res.status(200).json({
        message: "You have no delivery tasks yet.",
        deliveries: []
      });
}
 return res.status(200).json({
      count: deliveries.length,
      deliveries
    });
}
catch (err) {
    console.error("Error in getMyDeliveries:", err);
    return res.status(500).json({ error: err.message });
  }
}
exports.cancelDelivery=async(req,res)=>{
  try {
    const deliveryId = req.params.id;
    const userId = req.user.id;
    const roles = req.user.roles || [];
    const delivery = await model.getDelivery(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    const isVolunteerOwner = delivery.volunteer_user_id === userId;
    const isAdminOrNgo =
      roles.includes('admin') || roles.includes('ngo_staff');

    if (!isVolunteerOwner && !isAdminOrNgo) {
      return res.status(403).json({
        message: 'You are not allowed to cancel this delivery'
      });
    }
    if (delivery.status === 'DELIVERED' || delivery.status === 'FAILED') {
      return res.status(400).json({
        message: `Delivery with status '${delivery.status}' cannot be cancelled`
      });
    }
     const match = await matchModel.getById(delivery.match_id);
    if (!match) {
      return res.status(500).json({ message: 'This delivery not matched' });
    }
      const request = await requestModel.showRequest(match.request_id);
    if (!request) {
      return res.status(500).json({ message: 'Request not found for this match' });
    }
     if (request.status === 'FULFILLED') {
      return res.status(400).json({
        message: 'Cannot cancel delivery for a fulfilled request'
      });
    }
     await model.changeDeliveryStatus(deliveryId, 'FAILED', {
      setDropoffTime: true 
    });
    await matchModel.updateStatus(match.id, 'DECLINED');
     await requestModel.editRequestStatus(
      request.id,
      request.status,
      'OPEN',
      userId,
      'Delivery cancelled'
    );

 if (match.listing_id) {
      try {
        const listingUpdated = await catalogModel.editStatus(match.listing_id, 'AVAILABLE');
        if (!listingUpdated) {
          console.warn('Warning: listing status not updated when cancelling delivery');
        }
      } catch (e) {
        console.error('Error updating listing status on cancelDelivery:', e);
      }
    }
    return res.status(200).json({
      message: 'Delivery cancelled successfully. Request reopened and listing available again.'
    });

  }
  catch (err) {
    console.error('Error in cancelDelivery:', err);
    return res.status(500).json({ error: err.message });
  }
}