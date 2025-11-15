const express = require('express');
const app = express();
require('dotenv').config();
const main = require('../config/db');
const authRouter = require("./routes/userAuth");
const User = require("./../models/User");

app.use(express.json());
app.use('/auth',authRouter);

const initializeServer = async()=>{
   await main();
   app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port : ${process.env.PORT}`)
    })
}

initializeServer();