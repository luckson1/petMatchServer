const express= require('express')
const multer = require('../utils/multer');
const authentication = require('../middlewear/authentication');
const { registerUserCtrl, createProfileCtrl, loginUserCtrl, fetchUserCtrl, updatePetMatchesCtrl } = require('../controllers/Users');
userRoutes=express.Router()


const upload = multer.single('image');

userRoutes.post("/register", registerUserCtrl)
userRoutes.put("/", upload, authentication, createProfileCtrl )
userRoutes.post ("/login", loginUserCtrl)
userRoutes.get("/profile",authentication, fetchUserCtrl)
userRoutes.put("/:id", authentication, updatePetMatchesCtrl)
module.exports={userRoutes}