const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
// counseling & sessions
const counselingRoutes = require('./routes/counselingRoutes.js');
const cancelSessionRoutes = require('./routes/cancelSessionRoutes.js');
const patientSessionsRoutes = require('./routes/getPatientSessionsRoutes.js');
const doctorSessionsRoutes = require('./routes/getDoctorSessionsRoutes.js');
// support Groups
const supportGroupsRoutes = require('./routes/supportGroupsRoutes.js');
const updateSupportGroupRoutes = require('./routes/updateSupportGroupRoutes.js');
const deleteSupportGroupRoutes = require('./routes/deleteSupportGroupRoutes.js');
const supportGroupMembersRoutes = require('./routes/supportGroupMembersRoutes.js');
const joinRequestRoutes = require('./routes/joinRequestRoutes.js');
const messagesRoutes = require('./routes/supportGroupMessagesRoutes.js');
const removeMemberRoutes = require('./routes/removeMemberRoutes.js');
// anonymous Chat
const anonChatRoutes = require('./routes/anonChatRoutes.js');
const anonChatMessagesRoutes = require('./routes/anonChatMessagesRoutes.js');
const getAnonChatMessagesRoutes = require('./routes/getAnonChatMessagesRoutes.js');
// ngos
const ngosRoutes = require('./routes/ngosRoutes.js');
const getNgosRoutes = require('./routes/getNgosRoutes.js');
const updateNgoRoutes = require('./routes/updateNgoRoutes.js');
// doctor availability
const availabilityRoutes = require('./routes/doctorAvailabilityRoutes.js');
const getAvailabilityRoutes = require('./routes/getDoctorAvailabilityRoutes.js');
// appointments
const appointmentRequestRoutes = require('./routes/appointmentRequestRoutes.js');
const appointmentApproveRoutes = require('./routes/appointmentApproveRoutes.js');
const appointmentRejectRoutes = require('./routes/appointmentRejectRoutes.js');
const getDoctorAppointmentsRoutes = require('./routes/getDoctorAppointmentsRoutes.js');
const getPatientAppointmentsRoutes = require('./routes/getPatientAppointmentsRoutes.js');
const appointmentCancelRoutes = require('./routes/appointmentCancelRoutes.js');
// Surgical Missions
const surgicalMissionRoutes = require('./routes/surgicalMissionRoutes.js');
const upcomingMissionsRoutes = require('./routes/getUpcomingMissionsRoutes.js');
const missionDetailsRoutes = require('./routes/getMissionDetailsRoutes.js');
const missionRegistrationRoutes = require('./routes/missionRegistrationRoutes.js');
const missionApproveRoutes = require('./routes/missionApproveRoutes.js');
const missionRejectRoutes = require('./routes/missionRejectRoutes.js');
const missionPatientsRoutes = require('./routes/getMissionPatientsRoutes.js');

// NGOs
app.use('/ngos/update', updateNgoRoutes);
app.use('/ngos/all', getNgosRoutes);
app.use('/ngos', ngosRoutes);
// anonymous Chat
app.use('/anon-chat/messages', getAnonChatMessagesRoutes);
app.use('/anon-chat/messages', anonChatMessagesRoutes);
app.use('/anon-chat', anonChatRoutes);
// support Groups
app.use('/support-groups/messages', messagesRoutes);
app.use('/support-groups/members/remove', removeMemberRoutes);
app.use('/support-groups/members', supportGroupMembersRoutes);
//app.use('/support-groups/delete', deleteSupportGroupRoutes);
app.use('/support-groups', deleteSupportGroupRoutes);
app.use('/support-groups/update', updateSupportGroupRoutes);
app.use('/support-groups', supportGroupsRoutes);
// counseling Sessions
app.use('/counseling/sessions', counselingRoutes);
app.use('/counseling/cancel', cancelSessionRoutes);
app.use('/counseling/patient', patientSessionsRoutes);
app.use('/counseling/doctor', doctorSessionsRoutes);
app.use('/support-groups/join-request', joinRequestRoutes);
// availability
app.use('/availability', availabilityRoutes);
app.use('/availability/doctor', getAvailabilityRoutes);
// appointments
app.use('/appointments', appointmentRequestRoutes);
app.use('/appointments', appointmentApproveRoutes);
app.use('/appointments', appointmentRejectRoutes);
app.use('/appointments/doctor', getDoctorAppointmentsRoutes);
app.use('/appointments/patient', getPatientAppointmentsRoutes);
app.use('/appointments', appointmentCancelRoutes);
// surgical Missions
app.use('/missions', surgicalMissionRoutes);
app.use('/missions', upcomingMissionsRoutes);
app.use('/missions/details', missionDetailsRoutes);
app.use('/missions', missionRegistrationRoutes);
app.use('/missions', missionApproveRoutes);
app.use('/missions', missionRejectRoutes);
app.use('/missions', missionPatientsRoutes);
module.exports = app;
