const model = require('../repositories/requestRepository')

exports.createRequest = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }
    const request = {
      //   id:req.body.id,
      requester_user_id: req.user.id,
      type: req.body.type,
      name: req.body.name,
      dosage_or_specs: req.body.dosage_or_specs,
      urgency: req.body.urgency,
      quantity: req.body.quantity,
      unit: req.body.unit,
      location_geo: req.body.location_geo,
      notes: req.body.notes
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

exports.viewRequest = async (req, res) => {
  try {
    const request = await model.showRequest(req.params.id)
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.viewAllRequests = async (req, res) => {
  try {
    const {
      type,
      urgency,
      status,
      location_geo,
      search,
      requester_id
    } = req.query;
    const filters = {
      type,
      urgency,
      status,
      location_geo,
      search,
      requester_id
    };

    const request = await model.showAllRequests(filters)
    if (!request) return res.status(404).json({ message: 'No request found' });
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

exports.viewMyRequests = async (req, res) => {
  try {
    const request = await model.showMyRequests(req.user.id)
    if (!request) return res.status(404).json({ message: 'No requests found for this user' });
    res.status(200).json(request);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

exports.UpdateStatus = async (req, res) => {
  try {
    const newStatus = req.body.status
    const userId = req.user.id
    const allowedStatuses = ['OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const request = await model.showRequest(req.params.id)
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    const oldStatus = request.status
    if (oldStatus === "OPEN") {
      if (newStatus !== 'MATCHED' && newStatus !== 'CANCELLED') {
        return res.status(400).json({
          message: `From OPEN you can only go to MATCHED or CANCELLED`
        });
      }
    }
    else if (oldStatus === 'MATCHED') {
      if (newStatus !== 'FULFILLED' && newStatus !== 'CANCELLED') {
        return res.status(400).json({
          message: `From MATCHED you can only go to FULFILLED or CANCELLED`
        });
      }
    }
    else if (oldStatus === 'FULFILLED' || oldStatus === 'CANCELLED') {
      return res.status(400).json({
        message: `Request with status '${newStatus}' cannot be changed`
      });
    }

    const change = await model.editRequestStatus(req.params.id, oldStatus, newStatus, userId, req.body.note || null);
    if (!change) {
      return res.status(500).json({ message: 'Failed to update status' });
    }
    id = req.params.id
    return res.status(200).json({
      message: 'Status updated successfully',
      id,
      newStatus
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

exports.createMatch = async (req, res) => {

}
