const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../middlewear/generateTokens");
const User = require("../models/Users");
const cloudinary = require("../utils/cloudinary");
const { v4: uuidv4 } = require("uuid");

// registering a user

const registerUserCtrl = expressAsyncHandler(async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    vaccines,
    reason,
    isAdmin,
    petOwned,
  } = req?.body;
  const userId = uuidv4();

  // generate token
  const token = generateToken(userId);

  //find if a user exists

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  try {
    // if new, create one
    const user = await User.create({
      email,
      firstName,
      lastName,
      password,
      userId,
      petOwned,
      vaccines,
      reason,
      isAdmin,
    });
    console.log(user);
    const token = generateToken(userId);
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

// login user
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const user = await User.findOne({ email });

  //Check if password is match
  if (user && (await user?.isPasswordMatch(password))) {
    res.json({
      token: generateToken(user?.userId),
      user,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

// create profile

const createProfileCtrl = expressAsyncHandler(async (req, res) => {
  const id = req?.user?.id;

  const {
    gender,
    petPreference,
    children,
    petOwned,
    garden,
    active,
    petAge,
    previousPets,
  } = req?.body;

  const updateDocument = {
    $set: {
      gender: gender,
      petPreference: petPreference,
      children: children,
      petOwned: petOwned,
      garden: garden,
      active: active,
      petAge: petAge,
      previousPets: previousPets,
    },
  };

  try {
    const user = await User.findByIdAndUpdate(id, updateDocument);

    res.json({ user });
  } catch (error) {
    res.json({ error });
  }
});

// fetch one user

const fetchUserCtrl = expressAsyncHandler(async (req, res) => {
  const id = req?.user?.id;

  try {
    const user = await User.findById(id);
    res.json({ user });
  } catch (error) {
    res.json({ error });
  }
});

//fetch all the users
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});

    res.json({ users });
  } catch (error) {
    res.json({ error });
  }
});

// update user data with the matched pet

const updatePetMatchesCtrl = expressAsyncHandler(async (req, res) => {
  const id = req?.user?.id;
  const petId = req?.params?.id;

  // check if pet is already matched
  const petMatched = req?.user?.petMatches?.includes(petId);
  if (petMatched) throw new Error("Pet already matched!");

  const updateDocument = {
    $push: { petMatches: petId },
  };

  try {
    const user = await User.findByIdAndUpdate(id, updateDocument);
    await user.save();
    res.json({ user });
  } catch (error) {
    res.json({ error });
  }
});
module.exports = {
  registerUserCtrl,
  loginUserCtrl,
  createProfileCtrl,
  fetchUserCtrl,
  updatePetMatchesCtrl,
  fetchUsersCtrl,
};
