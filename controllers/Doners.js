const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../middlewear/generateTokens");
const Doner = require("../models/Doners");
const cloudinary = require("../utils/cloudinary");
const { v4: uuidv4 } = require("uuid");

// registering a doner

const registerDonerCtrl = expressAsyncHandler(async (req, res) => {
  const { email, firstName, lastName, password } = req?.body;
  const donerId = uuidv4();

  // generate token
  const token = generateToken(donerId);

  //find if a doner exists

  const donerExists = await Doner.findOne({ email });
  if (donerExists) throw new Error("doner already exists");

  try {
    // if new, create one
    const doner = await Doner.create({
      email,
      firstName,
      lastName,
      password,
      donerId,
    });

    const token = generateToken(donerId);
    res.json({ doner, token });
  } catch (error) {
    res.json({ error });
  }
});

// login doner
const loginDonerCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if doner exists
  const doner = await Doner.findOne({ email });

  //Check if password is match
  if (doner && (await doner?.isPasswordMatch(password))) {
    res.json({
      token: generateToken(doner?.donerId),
      doner,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

// create profile

const createProfileCtrl = expressAsyncHandler(async (req, res) => {
  const id = req?.user?.id;

  const { petOwned, vaccine, reason } =
    req?.body;

  const updateDocument = {
    $set: {
    
     petOwned: petOwned,
     reason: reason,
     vaccine: vaccine,
    
     
    },
  };

  try {
    const doner = await Doner.findByIdAndUpdate(id, updateDocument);

    res.json({ doner });
  } catch (error) {
    res.json({ error });
  }
});

// fetch one doner

const fetchDonerCtrl = expressAsyncHandler(async (req, res) => {
  const id = req?.user?.id;

  try {
    const doner = await Doner.findById(id);
    res.json({ doner });
  } catch (error) {
    res.json({ error });
  }
});

//fetch all the doners
const fetchDonersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const doners = await Doner.find({});

    res.json({ doners });
  } catch (error) {
    res.json({ error });
  }
});


module.exports = {
  registerDonerCtrl,
  loginDonerCtrl,
  createProfileCtrl,
  fetchDonerCtrl,
  fetchDonersCtrl,
};
