const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();


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
