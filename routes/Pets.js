const express= require('express')
const authentication = require('../middlewear/authentication');
const { createPetProfileCtrl, fetchPetsByTypeCtrl, fetchMatchedPetsCtrl } = require('../controllers/Pets');
const Multer = require('../utils/multer');
const upload = Multer.single('image');
petRoutes=express.Router()


petRoutes.post("/", authentication, upload, createPetProfileCtrl);
petRoutes.get("/", authentication, fetchPetsByTypeCtrl)
petRoutes.get("/matched", authentication, fetchMatchedPetsCtrl)
module.exports={petRoutes}