const express = require("express");
const authentication = require("../middlewear/authentication");
const {
  createPetProfileCtrl,
  fetchPetsByTypeCtrl,
  fetchMatchedPetsCtrl,
  fetchAllPetsCtl,
  updatePetCtl,
  deletePetCtl,
} = require("../controllers/Pets");
const Multer = require("../utils/multer");
const upload = Multer.single("image");
const petRoutes = express.Router();

petRoutes.post("/", authentication, upload, createPetProfileCtrl);
petRoutes.get("/", authentication, fetchPetsByTypeCtrl);
petRoutes.get("/all", authentication, fetchAllPetsCtl);
petRoutes.get("/matches", authentication, fetchMatchedPetsCtrl);
petRoutes.put("/:id", authentication, updatePetCtl);
petRoutes.delete("/:id", authentication, deletePetCtl);
module.exports = { petRoutes };
