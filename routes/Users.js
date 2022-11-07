const express = require("express");

const authentication = require("../middlewear/authentication");
const {
  registerUserCtrl,
  createProfileCtrl,
  loginUserCtrl,
  fetchUserCtrl,
  updatePetMatchesCtrl,
  fetchUsersCtrl,
} = require("../controllers/Users");
const Multer = require("../utils/multer");
const upload = Multer.single("image");
const userRoutes = express.Router();

userRoutes.get("/", authentication, fetchUsersCtrl);
userRoutes.get("/profile", authentication, fetchUserCtrl);
userRoutes.post("/register", registerUserCtrl);
userRoutes.put("/", authentication, createProfileCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.put("/:id", authentication, updatePetMatchesCtrl);
module.exports = { userRoutes };
