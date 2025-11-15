const User = require('../models/User');
const validate = require('../utils/validate')
const bcrypt = require('bcrypt')
const jwt = require('jwt');

const Register = async(req,res)=>{
      try{
          validate(req.body);// api  level validation
          const {firstName, emailId, password} = req.body();
          
          // we have to  hash pass -> using bcrypt -> using aawait becuase algorithm run 2^10 time
           const hashPass = await bcrypt.hash(password,10); 
           req.body.password = hashPass;
           await User.create(req.body);
           
           // jwt = header + payload + digital ginature
           // digital signature = header(algorithm) + payload (userId , emailId) +  Secret_Key 
           const token =  jwt.sign({_id:user._id , emailId:emailId},process.env.JWT_SECRET, {expiresIn: 60*60});
            // payload kuch aisa hojayega  { _id: "1234",emailId: "abc@gmail.com",iat: 1731674136, exp: 1731677736}
            // jwt automatic iat and exp lelega nhito same token generate hoga always 

           // ab cookie bhejna padega jwt chahiya
            res.cookie('token',token,{maxAge: 60*60*1000});  // ye frontend browser  me 1 hour bad expire hoga token
            res.send("User Created Successfully");
      }
      catch(err){
           res.status(400).send("Error: "+err);
    }
}

const Login = async(req,res)=>{
     try{
         const {emailId, password} = req.body;
         if(!emailId || !password) 
            throw new Error("Invalid Credentials")

         const user = User.findOne({emailId});

         const match = bcrypt.compare(password,user.password);
         if(!match)  throw new Error("Invalid Credentials");
         const token =  jwt.sign({_id:user._id , emailId:emailId},process.env.JWT_SECRET,{expiresIn: 60*60});
         res.cookie('token',token,{maxAge: 60*60*1000});
         res.send("Loggin Successfully")
     }
     catch{
         res.status(400).send("Error: "+err);
     }
}



module.exports = {Register , Login };