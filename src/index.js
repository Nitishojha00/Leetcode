const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const authRouter = require("./routes/userAuth");
const User = require("./models/User");
const redisClient = require("./config/redis");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser())

app.use('/user',authRouter);


const initializeConnection = async()=>{
    try{
        await Promise.all([redisClient.connect(),main()]);
        console.log("DB Connected");
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on Port ${process.env.PORT}`)
        })
    }
    catch(err)
    {
        console.log(err.message);
    }
}

initializeConnection();