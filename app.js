const express=require('express')
const bodyParser=require('body-parser')
const app=express()
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
const app = express();

const openapiDocument = YAML.load("./openapi.yaml");
console.log("JWT_SECRET =", process.env.JWT_SECRET);
const authRoutes = require('./routes/Feature 1.1/authRoutes');
const appointmentsRoutes = require('./routes/Feature 1.1/appointmentsRoutes');
const checker=require('./jobs/expiryCheck')
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
module.exports = app;
