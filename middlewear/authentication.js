const expressAsyncHandler= require("express-async-handler");
const jwt= require('jsonwebtoken');
const User = require("../models/Users");

const authentication=expressAsyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req?.headers?.authorization?.split(" ")[1];
      
      try {
        if (token) {
          
          const decodedUser = jwt.verify(token, process.env.JWT_KEY);
       const userId=decodedUser?.id;
       
          //find the user
          const user = await User.findOne({userId});
        
          //attach the user the req obj
          req.user = user;
          
          
          next();
        }
      } catch (error) {
        throw new Error("Not Authorized token expired");
      }
    } else {
      throw new Error("There is no token attached to the header");
    }
});

module.exports = authentication;