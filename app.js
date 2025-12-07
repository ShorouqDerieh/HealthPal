
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
const counselingRoutes = require('./routes/counselingRoutes.js');
const cancelSessionRoutes = require('./routes/cancelSessionRoutes.js');
const patientSessionsRoutes = require('./routes/getPatientSessionsRoutes.js');
const doctorSessionsRoutes = require('./routes/getDoctorSessionsRoutes.js');
const supportGroupsRoutes = require('./routes/supportGroupsRoutes.js');
const updateSupportGroupRoutes = require('./routes/updateSupportGroupRoutes.js');
const deleteSupportGroupRoutes = require('./routes/deleteSupportGroupRoutes.js');
const supportGroupMembersRoutes = require('./routes/supportGroupMembersRoutes.js');
const joinRequestRoutes = require('./routes/joinRequestRoutes.js');
const messagesRoutes = require('./routes/supportGroupMessagesRoutes.js');
const anonChatRoutes = require('./routes/anonChatRoutes.js');
const anonChatMessagesRoutes = require('./routes/anonChatMessagesRoutes.js');
const getAnonChatMessagesRoutes = require('./routes/getAnonChatMessagesRoutes.js');
app.use('/api/anon-chat/messages', getAnonChatMessagesRoutes);
app.use('/api/anon-chat/messages', anonChatMessagesRoutes);
app.use('/api/anon-chat', anonChatRoutes);
app.use('/api/support-groups/messages', messagesRoutes);
app.use('/api/support-groups/members', supportGroupMembersRoutes);
app.use('/api/support-groups/delete', deleteSupportGroupRoutes);
app.use('/api/support-groups/update', updateSupportGroupRoutes);
app.use('/api/support-groups', supportGroupsRoutes);
const removeMemberRoutes = require('./routes/removeMemberRoutes.js');
app.use('/api/support-groups/members/remove', removeMemberRoutes);
app.use('/api/counseling/sessions', counselingRoutes);
app.use('/api/counseling/cancel', cancelSessionRoutes);
app.use('/api/counseling/patient', patientSessionsRoutes);
app.use('/api/counseling/doctor', doctorSessionsRoutes);
app.use('/api/support-groups/join-request', joinRequestRoutes);
module.exports = app;