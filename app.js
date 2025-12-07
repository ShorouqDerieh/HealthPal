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
app.use('/files', fileRoutes);
app.use('/upload', express.static('upload'));
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
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
module.exports = app;
