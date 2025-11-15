const validator = require("validator")

const Validate = (data)=>{
     const mandatoryField = ['firstName',"emailId",'password'];
     const isAllowed =  mandatoryField.every((val)=>Object.keys(data).includes(val));
    //   Also  isAllowed = (data.firstName && data.emailId && data.password)
     if(!isAllowed)
          throw new Error("Some Fields Missing");

     if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email")
    
    if(!validator.isStrongPassword(data.password))
        throw new Error("Week Password");
}

module.exports = Validate;