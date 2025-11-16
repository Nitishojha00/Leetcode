const User = require('../models/User');
const validate = require('../utils/validate')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const redisClient = require("../config/redis");

const register = async(req,res)=>{
      try{
          validate(req.body);// api  level validation
          const {firstName, emailId, password} = req.body;
          // we have to  hash pass -> using bcrypt -> using aawait becuase algorithm run 2^10 time
           const hashPass = await bcrypt.hash(password,10); 
           req.body.password = hashPass;
           req.body.role = 'user'

           const user = await User.create(req.body);
           
           // jwt = header + payload + digital ginature
           // digital signature = header(algorithm) + payload (userId , emailId) +  Secret_Key 
           const token =  jwt.sign({_id:user._id , emailId:emailId , role:'user'},process.env.JWT_SECRET, {expiresIn: 60*60});
            // payload kuch aisa hojayega  { _id: "1234",emailId: "abc@gmail.com",iat: 1731674136, exp: 1731677736}
            // jwt automatic iat and exp lelega nhito same token generate hoga always 

           // ab cookie bhejna padega jwt chahiya
            res.cookie('token',token,{maxAge: 60*60*1000});  // ye frontend browser  me 1 hour bad expire hoga token
            res.status(201).send("User Created Successfully");
      }
      catch(err){
           res.status(400).send("Error: "+err);
    }
}

const login = async(req,res)=>{
     try{
         const {emailId, password} = req.body;
         if(!emailId || !password) 
            throw new Error("Invalid Credentials")

         const user = await User.findOne({emailId});
         
         const match = await bcrypt.compare(password,user.password);
         if(!match)
              throw new Error("Invalid Credentials");
         const token =  jwt.sign({_id:user._id , emailId:emailId},process.env.JWT_SECRET,{expiresIn: 60*60});
         res.cookie('token',token,{maxAge: 60*60*1000});
         res.send("Login Successfully")
     }
     catch{
         res.status(400).send("Error: "+err);
     }
}

// logOut feature

const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);


        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
        //    Token add kar dung Redis ke blockList
        //    Cookies ko clear kar dena.....

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}

const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


module.exports = {register , login , logout };