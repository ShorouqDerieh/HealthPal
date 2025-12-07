const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = express();

const openapiDocument = YAML.load("./openapi.yaml");
app.use(express.json());

app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 60_000, max: 120 }));


app.get('/', (req, res) => res.send('Welcome to HealthPal API'));


const authRoutes = require('./routes/Feature 1.1/authRoutes');
app.use('/auth', authRoutes);

const doctorRoutes=require('./routes/Feature 1.1/doctorsRoutes');
app.use('/doctors',doctorRoutes);
module.exports = app;
const appointmentsRoutes = require('./routes/Feature 1.1/appointmentsRoutes');
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