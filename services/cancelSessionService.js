// services/cancelSessionService.js
const CancelModel = require('../repositories/cancelSession.js');
async function cancel(sessionId) {
    const rows = await CancelModel.findSessionById(sessionId);

    if (rows.length === 0)
        throw { status: 404, message: "Session not found!" };

    if (rows[0].status === "CANCELLED")
        throw { status: 400, message: "Session already cancelled" };

    await CancelModel.cancel(sessionId);

    return sessionId;
}
module.exports = {
    cancel
};
