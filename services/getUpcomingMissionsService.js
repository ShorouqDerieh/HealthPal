// services/getUpcomingMissionsService.js
const Model = require('../repositories/getUpcomingMissionsModel.js');

async function list() {

    const missions = await Model.getUpcoming();

    return missions;
}
module.exports = {
    list
};
