const express=require('express')
const bodyParser=require('body-parser')
const app=express()
app.use(bodyParser.json())
const request=require('./routes/requestRoutes')
const listing=require('./routes/catalogRoutes')
/* app.get('/',(req,res)=>{
    res.send("Welcome to HelthPal")
}) */
app.use('/requests',request)
app.use('/catalogs',listing)
module.exports=app
