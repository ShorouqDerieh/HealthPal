const express=require('express')
const bodyParser=require('body-parser')
const app=express()
app.use(bodyParser.json())
const request=require('./routes/requests')
/* app.get('/',(req,res)=>{
    res.send("Welcome to HelthPal")
}) */
module.exports=app