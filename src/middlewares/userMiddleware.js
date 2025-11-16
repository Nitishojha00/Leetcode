const user  = require('../models/User');
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const userMiddleware = async(req,res,next)=>{
    try{
        // if it is wrong automaticall thhrow error
        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not persent");

        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const result = await user.findById(_id);

        if(!result){
            throw new Error("User Doesn't Exist");
        }

        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) throw new Error("Invalid Token");
        
        req.result = result;
        next();
    }
    catch(err){
        res.status(401).send("Error: "+ err.message)
    }
};

module.exports = userMiddleware;