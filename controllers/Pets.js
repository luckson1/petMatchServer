const expressAsyncHandler = require("express-async-handler");
const Pet = require("../models/Pets");
const User = require("../models/Users");
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();

const createPetProfileCtrl = expressAsyncHandler(async (req, res) => {
  const donor=req?.user?.userId
  const {
    name,
    breed,
    petAge,
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
      petAge: petAge,
      gender: gender,
      petTorrelance: petTorrelance,
      children: children,
      petType: petType,
      garden: garden,
      active: active,
      about: about,
      image: image,
      donor: donor
    });

    res.json({ pet });
  } catch (error) {
    res.json({ error });
  }
});

// fetch pets by type (dog or cat)

const fetchPetsByTypeCtrl = expressAsyncHandler(async (req, res) => {
  const { petPreference, children, petOwned, garden, active, petAge, isAdmin} = req?.user;

  try {
    let petPreferenceQuery = {};
    let childrenQuery = {};
    let gardenQuery = {};
    let activeQuery = {};
    let petTorrelanceQuery = {};
    let ageQuery= {}

    // filter pets based on preference (either dog, cat or both)
    if (petPreference === "any") {
      petPreferenceQuery = {};
    } else {
      petPreferenceQuery = { petType: petPreference };
    }
 // filter pets based on age preference 
if(petAge === "any") {
  ageQuery={}
}else if (!petAge) {
  ageQuery= {}
} else {
  ageQuery={petAge: petAge}
}
    //filter pets based on whether they are socialised with children below 8 years
    // check if family has small children and filter accordingly
    if (children === "no") {
      childrenQuery = {};
    } else if (children==="Yes above 8"){
      childrenQuery = {};
    }else {
      childrenQuery = { children: children };
    }

    //filter pets based on whether they need  a garden or not
    // check if family has a garden and filter accordingly
    if (garden === "yes") {
      gardenQuery = {};
    } else if (garden==="shared"){
      gardenQuery = {};
    }else {
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
    }else if (petOwned === "cat" && petPreference == "dogs") {
      petTorrelanceQuery = { petTorrelance: "both" };
    }else if (petOwned === "cat" && petPreference === "cats") {
      petTorrelanceQuery = {};
    }else if (petOwned === "dog" && petPreference === "cats") {
      petTorrelanceQuery = { petTorrelance: "both" };
    }else if (petOwned === "dog" && petPreference === "dogs") {
      petTorrelanceQuery = {};
    }else if (petOwned === "both") {
      petTorrelanceQuery = { petTorrelance: "both" };
    }
//admins access all the pets
    if(isAdmin===true){
      petPreferenceQuery={},
      childrenQuery={},
      gardenQuery={},
      activeQuery={},
      petTorrelanceQuery={},
      ageQuery={}
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
            ageQuery
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
    res.json({ error });
  }
};

//fetch a given doners pets
const fetchDonersPetsCtl = async (req, res) => {
  const donor=req?.user?.userId
console.log(donor)
  try {
    const pets = await Pet.find({donor:donor});
 
    res.json({ pets });
  } catch (error) {
    res.jason({ error });
  }
};

const updatePetCtl = async (req, res) => {
  const {id }= req.params;
  const {
    name,
    breed,
    petAge,
    gender,
    petTorrelance,
    children,
    petType,
    garden,
    active,
   
  } = req?.body;
  try {
    const pet = await Pet.findByIdAndUpdate(
      id ,
      {
        name,
        breed,
        petAge,
        gender,
        petTorrelance,
        children,
        petType,
        garden,
        active,
       
      }
    );
 
    res.json({ pet });
    console.log(pet)
  } catch (error) {
    res.json({ error });
  }
};
const deletePetCtl= async(req, res)=> {
  const {id}=req.params
 
  try {
    const pet= await Pet.findByIdAndDelete(id)
    res.json({})
  } catch (error) {
    res.json({ error });
  }
}
module.exports = {
  createPetProfileCtrl,
  fetchPetsByTypeCtrl,
  fetchMatchedPetsCtrl,
  fetchAllPetsCtl,
  updatePetCtl,
  deletePetCtl,
  fetchDonersPetsCtl
};
