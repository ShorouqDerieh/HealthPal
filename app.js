const express = require('express')
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config();
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
//const removeMemberRoutes = require('./routes/removeMemberRoutes.js');
// anonymous Chat
const anonChatRoutes = require('./routes/anonChatRoutes.js');
const anonChatMessagesRoutes = require('./routes/anonChatMessagesRoutes.js');
const getAnonChatMessagesRoutes = require('./routes/getAnonChatMessagesRoutes.js');
// ngos
const ngosRoutes = require('./routes/ngosRoutes.js');
const getNgosRoutes = require('./routes/getNgosRoutes.js');
const updateNgoRoutes = require('./routes/updateNgoRoutes.js');
const AlertRoute=require('./routes/AlertRoutes.js')
const notificationPrefsRoutes = require('./routes/notificationPreferencesRoutes.js');
const shortageRoutes=require('./routes/shortageAlertsRoutes.js')
app.use('/shortages',shortageRoutes)
app.use('/notification-preferences',notificationPrefsRoutes)
app.use('/alerts',AlertRoute)
//const ngosRoutes = require('./routes/ngosRoutes.js');
const removeMemberRoutes = require('./routes/removeMemberRoutes.js');
const webinarRoutes = require('./routes/webinarsRoutes.js');
app.use('/webinars', webinarRoutes);
app.use(bodyParser.json())
const request=require('./routes/requestRoutes')
const listing=require('./routes/catalogRoutes')
const doctorRoutes=require('./routes/Feature 1.1/doctorsRoutes');
const matches=require('./routes/matchRoute')
const deliveries=require('./routes/deliveryRoutes')
const fileRoutes = require('./routes/fileRoutes');
const healthGuideRoutes = require('./routes/healthGuideRoutes');
app.use('/files', fileRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/health-guides', healthGuideRoutes);
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const openapiDocument = YAML.load("./openapi/openapi.yaml");
//console.log("JWT_SECRET =", process.env.JWT_SECRET);
const authRoutes = require('./routes/Feature 1.1/authRoutes');
const appointmentsRoutes = require('./routes/Feature 1.1/appointmentsRoutes');
const checker=require('./jobs/expiryCheck')
const alertCheck=require('./jobs/alertsCron.js')
app.use('/requests',request)
app.use('/catalog',listing)
app.use('/matches',matches)
app.use('/deliveries',deliveries)
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.get('/', (req, res) => res.send('Welcome to HealthPal API'));
app.use('/auth', authRoutes);
app.use('/doctors',doctorRoutes);
app.use('/appointments', appointmentsRoutes);
const consultRoutes = require('./routes/Feature 1.2/consultRoutes');
app.use('/consult', consultRoutes);

const translationRoutes = require("./routes/Feature 1.3/translationRoutes");
app.use("/translation", translationRoutes);
const sponsorshipRoutes = require("./routes/Feature 2.1/sponsorshipRoutes");
app.use("/sponsorship", sponsorshipRoutes);
const patientProfileRoutes = require("./routes/Feature 2.2/patientProfileRoutes");
app.use("/patient-profiles", patientProfileRoutes);
app.use("/transparency", require("./routes/Feature 2.3"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

//const PORT = process.env.PORT || 3000;

/*app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs on http://localhost:${PORT}/api-docs`);
});*/
//console.log("DAILY_API_KEY:", process.env.DAILY_API_KEY);
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
