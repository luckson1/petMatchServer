const expressAsyncHandler = require("express-async-handler");
const Pet = require("../models/Pets");
const User = require("../models/Users");
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();

const createPetProfileCtrl = expressAsyncHandler(async (req, res) => {
  const {
    name,
    breed,
    age,
    gender,
    petTorrelance,
    children,
    petType,
    garden,
    active,
    about,
  } = req?.body;

  const filePath = req?.file?.path;

  try {
    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(filePath);

    // get url of uploaded image
    const image = result?.secure_url;
    const pet = await Pet.create({
      name: name,
      breed: breed,
      age: age,
      gender: gender,
      petTorrelance: petTorrelance,
      children: children,
      petType: petType,
      garden: garden,
      active: active,
      about: about,
      image: image,
    });
    res.json({ pet });
  } catch (error) {
    res.json({ error });
  }
});

// fetch pets by type (dog or cat)

const fetchPetsByTypeCtrl = expressAsyncHandler(async (req, res) => {
  const { petPreference, children, petOwned, garden, active } = req?.user;

  try {
    let petPreferenceQuery = {};
    let childrenQuery = {};
    let gardenQuery = {};
    let activeQuery = {};
    let petTorrelanceQuery = {};

    // filter pets based on preference (either dog, cat or both)
    if (petPreference === "any") {
      petPreferenceQuery = {};
    } else {
      petPreferenceQuery = { petType: petPreference };
    }

    //filter pets based on whether they are socialised with children below 8 years
    // check if family has small children and filter accordingly
    if (children === "no") {
      childrenQuery = {};
    } else {
      childrenQuery = { children: children };
    }

    //filter pets based on whether they need  a garden or not
    // check if family has a garden and filter accordingly
    if (garden === "yes") {
      gardenQuery = {};
    } else {
      gardenQuery = { garden: garden };
    }

    //filter pets based on whether they are able to undertake vigorous physical activities
    // check if family will need to actively play with the pet and filter accordingly
    if (active === "no") {
      activeQuery = {};
    } else {
      activeQuery = { active: active };
    }

    //filter pets based on whether they are socialised with other pets
    // check if family has other pets and filter accordingly
    if (petOwned === "none") {
      petTorrelanceQuery = {};
    }
    if (petOwned === "cat" && petPreference == "dogs") {
      petTorrelanceQuery = { petTorrelance: "both" };
    }
    if (petOwned === "cat" && petPreference === "cats") {
      petTorrelanceQuery = {};
    }
    if (petOwned === "dog" && petPreference === "cats") {
      petTorrelanceQuery = { petTorrelance: "both" };
    }
    if (petOwned === "dog" && petPreference === "dogs") {
      petTorrelanceQuery = {};
    }
    if (petOwned === "both") {
      petTorrelanceQuery = { petTorrelance: "both" };
    }
    const pets = await Pet.aggregate([
      {
        $match: {
          $and: [
            petPreferenceQuery,
            childrenQuery,
            gardenQuery,
            activeQuery,
            petTorrelanceQuery,
          ],
        },
      },
    ]);
    res.json(pets);
  } catch (error) {
    res.json({ error });
  }
});

// fetch matched pets

const fetchMatchedPetsCtrl = expressAsyncHandler(async (req, res) => {
  const petIds = req?.user?.petMatches;
  try {
    const pipeline = [
      {
        $match: {
          _id: {
            $in: petIds,
          },
        },
      },
    ];
    const foundPets = await Pet.aggregate(pipeline);
    res.json(foundPets);
  } catch (error) {
    res.json({ error });
  }
});

//fetch all pets
const fetchAllPetsCtl = async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.json({ pets });
  } catch (error) {
    res.jason({ error });
  }
};

module.exports = {
  createPetProfileCtrl,
  fetchPetsByTypeCtrl,
  fetchMatchedPetsCtrl,
  fetchAllPetsCtl,
};
