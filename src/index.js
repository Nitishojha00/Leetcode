const express = require('express');
const app = express();
require('dotenv').config();
const main = require('../config/db');
const User = require("../models/User")

app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello Home Page ☺️🔥🔥");
})

const initializeServer = async()=>{
   await main();
   app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port : ${process.env.PORT}`)
    })
}

initializeServer();