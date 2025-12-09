const catalog = require('../repositories/catalogRepository');
const match = require('../repositories/matchRepository');
const requestModel = require('../repositories/requestRepository');

exports.createMatch = async (req, res) => {
  try {
    const userId = req.user.id; 
    const listingId = req.params.listingId;
    const requestId = req.params.requestId;

    const request = await requestModel.showRequest(requestId);
    console.log('Request from DB:', request);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== "OPEN") {
      return res.status(400).json({
        message: `Only OPEN requests can be matched. Current status is '${request.status}'`
      });
    }

    const listing = await catalog.viewOneItem(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'AVAILABLE') {
      return res.status(400).json({
        message: `Only AVAILABLE listings can be matched. Current status is '${listing.status}'`
      });
    }

    const createdMatch = await match.createMatch(requestId, listingId, userId);

    const listingUpdated = await catalog.editStatus(listingId, 'RESERVED');
    if (!listingUpdated) {
      console.error('listing status not updated!');
    }

    const note = `Matched with listing #${listingId}`;
    await requestModel.editRequestStatus(
      requestId,
      request.status,  
      "MATCHED",
      userId,
      note
    );

    return res.status(201).json({
      message: 'Match created successfully',
      match: createdMatch
    });

  } catch (err) {
    console.error('Error in createMatch:', err);
    return res.status(500).json({ error: err.message });
  }
};
