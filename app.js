
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
const counselingRoutes = require('./routes/counselingRoutes.js');
const cancelSessionRoutes = require('./routes/cancelSessionRoutes.js');
const patientSessionsRoutes = require('./routes/getPatientSessionsRoutes.js');
const doctorSessionsRoutes = require('./routes/getDoctorSessionsRoutes.js');
const supportGroupsRoutes = require('./routes/supportGroupsRoutes.js');
app.use('/api/support-groups', supportGroupsRoutes);
app.use('/api/counseling/sessions', counselingRoutes);
app.use('/api/counseling/cancel', cancelSessionRoutes);
app.use('/api/counseling/patient', patientSessionsRoutes);
app.use('/api/counseling/doctor', doctorSessionsRoutes);
module.exports = app;