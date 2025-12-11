const webinar=require('../repositories/webinarsRepository')
const webinarRepo=require('../repositories/webinarRegistrationsRepository')
const { createDailyRoom } = require('../utils/dailyApi');
exports.allWebinars=async(req,res)=>{
    try{
         const { upcomingOnly, host_org_id, search } = req.query;
          const filters = {
        upcomingOnly: upcomingOnly === "false" ? false : true, 
        hostOrgId: host_org_id ? Number(host_org_id) : undefined,
        search: search || undefined,
      };
      const webinars=await webinar.showAllWebinars(filters);
       res.json(webinars);
    } catch (err) {
       console.error(err);
    res.status(500).json({ error: err.message });
    }
}
exports.showOneWebinar=async(req,res)=>{
    try{
        const id=Number(req.params.id)
         if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid webinar ID" });
    }
    const oneWebinar=await webinar.showWebinarById(id)
     if (!oneWebinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    res.json(oneWebinar);
    }
    catch (err) {
       console.error(err);
    res.status(500).json({ error: err.message });
    }
}
exports.createWebinar=async(req,res)=>{
    try{
    const {
      title,
      description,
      starts_at,
      ends_at,
      host_org_id,
      meeting_link,
      location,
    } = req.body;
     if (!title || !starts_at || !ends_at) {
      return res.status(400).json({
        message: 'title, starts_at and ends_at are required',
      });
    }
    const startDate = new Date(starts_at);
    const endDate = new Date(ends_at);
     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        message: 'starts_at and ends_at must be valid dates',
      });
    }
    if (endDate <= startDate) {
      return res.status(400).json({
        message: 'ends_at must be greater than starts_at',
      });
    }
     let finalMeetingLink = meeting_link || null;
       if (!finalMeetingLink && process.env.DAILY_API_KEY) {
      try {
        const room = await createDailyRoom({
          title,
          startsAt: starts_at,
          endsAt: ends_at,
        });
        finalMeetingLink = room.url; 
      } catch (e) {
        console.error('Daily API error:', e.response?.data || e.message);
        return res
          .status(502)
          .json({ message: 'Failed to create video room (Daily API)' });
      }
    }

      const newId = await webinar.createWebinar({
      title,
      description,
      starts_at,
      ends_at,
      host_org_id,
     meeting_link: finalMeetingLink,
      location,
    });
       const created = await webinar.showWebinarById(newId);
         res.status(201).json(created);
    }
     catch (err) {
       console.error(err);
    res.status(500).json({ error: err.message });
    }
}
exports.updateWebinar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid webinar ID' });
    }
    const {
      title,
      description,
      starts_at,
      ends_at,
      host_org_id,
      meeting_link,
      location,
    } = req.body;
    if (starts_at && ends_at) {
      const startDate = new Date(starts_at);
      const endDate = new Date(ends_at);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          message: 'starts_at and ends_at must be valid dates',
        });
      }
      if (endDate <= startDate) {
        return res.status(400).json({
          message: 'ends_at must be greater than starts_at',
        });
      }
    }
    const fieldsToUpdate = {
      title,
      description,
      starts_at,
      ends_at,
      host_org_id,
      meeting_link,
      location,
    };

    const affected = await webinar.updateWebinar(id, fieldsToUpdate);
    if (!affected) {
      return res.status(404).json({ message: 'Webinar not found or nothing to update' });
    }
    const updated = await webinar.showWebinarById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteWebinar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid webinar ID' });
    }
    const affected = await webinar.deleteWebinar(id);
    if (!affected) {
      return res.status(404).json({ message: 'Webinar not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.registerForWebinar=async(req,res)=>{
    try{
        const webinarId = Number(req.params.id);
    const userId = req.user.id;  
    if (isNaN(webinarId)) {
      return res.status(400).json({ message: 'Invalid webinar ID' });
    }
    const newWebinar = await webinar.showWebinarById(webinarId);
    if (!newWebinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }
    try{
      const newRegId = await webinarRepo.createRegistration(
        webinarId,
        userId
      );
       const registration = await webinarRepo.findByWebinarAndUser(
        webinarId,
        userId
      );
         return res.status(201).json({
        message: 'Registered successfully',
        registration,
      });
    }
 catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          message: 'You are already registered for this webinar',
        });
      }
      throw err;
    }
}
    catch(err)
    {
          console.error(err);
    res.status(500).json({ error: err.message });
    }
  }
  exports.cancelRegistration = async (req, res) => {
  try {
    const webinarId = Number(req.params.id);
    const userId = req.user.id;
    if (isNaN(webinarId)) {
      return res.status(400).json({ message: 'Invalid webinar ID' });
    }
    const deletedWebinar = await webinar.showWebinarById(webinarId);
    if (!deletedWebinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }
    const affected = await webinarRepo.deleteRegistration(
      webinarId,
      userId
    );
    if (!affected) {
      return res.status(404).json({
        message: 'You are not registered for this webinar',
      });
    }
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getMyWebinars=async(req,res)=>{
  try{
       const webinars = await webinarRepo.getUserRegistration(req.user.id)
        return res.json(webinars);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
exports.getWebinarAttendees = async (req, res) => {
  try {
    const webinarId = Number(req.params.id);
    if (isNaN(webinarId)) {
      return res.status(400).json({ message: 'Invalid webinar ID' });
    }
    const targetWebinar = await webinar.showWebinarById(webinarId);
    if (!targetWebinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }
    const attendees = await webinarRepo.getAttendeesForWebinar(webinarId);
    return res.json(attendees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
