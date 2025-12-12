// services/getUpcomingMissionsService.js
const Model = require('../repositories/getUpcomingMissions.js');

async function list() {

    const missions = await Model.getUpcoming();

    return missions;
}
module.exports = {
    list
};
