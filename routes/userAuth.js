const express = require('express');
const authRouter = express.Router();
const {Register,Login} = require("../controller/userAuthent")

authRouter.post('/register',Register);
authRouter.post('/login',Login)
// authRouter.post('/logout',Logout)

module.exports = authRouter;