const express = require("express");

const authentication = require("../middlewear/authentication");
const {
    registerDonerCtrl,
    loginDonerCtrl,
    createProfileCtrl,
    fetchDonerCtrl,
    fetchDonersCtrl,
} = require("../controllers/Doners");
const Multer = require("../utils/multer");
const upload = Multer.single("image");
const donerRoutes = express.Router();

donerRoutes.get("/", authentication, fetchDonersCtrl);
donerRoutes.get("/profile", authentication, fetchDonerCtrl);
donerRoutes.post("/register", registerDonerCtrl);
donerRoutes.put("/", authentication, createProfileCtrl);
donerRoutes.post("/login", loginDonerCtrl);
module.exports = { donerRoutes };
