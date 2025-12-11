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
const ngosRoutes = require('./routes/ngosRoutes.js');
const getNgosRoutes = require('./routes/getNgosRoutes.js');
const updateNgoRoutes = require('./routes/updateNgoRoutes.js');
const AlertRoute=require('./routes/AlertRoutes.js')
const notificationPrefsRoutes = require('./routes/notificationPreferencesRoutes.js');
app.use('/notification-preferences',notificationPrefsRoutes)
app.use('/api/ngos/update', updateNgoRoutes);
app.use('/api/ngos/all', getNgosRoutes);
app.use('/alerts',AlertRoute)
//const ngosRoutes = require('./routes/ngosRoutes.js');
app.use('/api/ngos', ngosRoutes);
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
const webinarRoutes = require('./routes/webinarsRoutes.js');
app.use('/webinars', webinarRoutes);
app.use('/api/counseling/sessions', counselingRoutes);
app.use('/api/counseling/cancel', cancelSessionRoutes);
app.use('/api/counseling/patient', patientSessionsRoutes);
app.use('/api/counseling/doctor', doctorSessionsRoutes);
app.use('/api/support-groups/join-request', joinRequestRoutes);
app.use(bodyParser.json())
const request=require('./routes/requestRoutes')
const listing=require('./routes/catalogRoutes')
const doctorRoutes=require('./routes/Feature 1.1/doctorsRoutes');
const matches=require('./routes/matchRoute')
const deliveries=require('./routes/deliveryRoutes')
const fileRoutes = require('./routes/fileRoutes');
const healthGuideRoutes = require('./routes/healthGuideRoutes');
app.use('/files', fileRoutes);
app.use('/upload', express.static('upload'));
app.use('/health-guides', healthGuideRoutes);
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const openapiDocument = YAML.load("./openapi.yaml");
console.log("JWT_SECRET =", process.env.JWT_SECRET);
const authRoutes = require('./routes/Feature 1.1/authRoutes');
const appointmentsRoutes = require('./routes/Feature 1.1/appointmentsRoutes');
const checker=require('./jobs/expiryCheck')
const alertCheck=require('./jobs/alertsCron.js')
app.use('/requests',request)
app.use('/catalog',listing)
app.use('/matches',matches)
app.use('/deliveries',deliveries)
app.use(express.json());
app.use(cors());
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

//const PORT = process.env.PORT || 3000;

/*app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs on http://localhost:${PORT}/api-docs`);
});*/
//console.log("DAILY_API_KEY:", process.env.DAILY_API_KEY);
module.exports = app;
