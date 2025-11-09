
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const counselingRoutes = require('./routes/counselingRoutes')

app.use('/api/counseling', counselingRoutes)

module.exports = app