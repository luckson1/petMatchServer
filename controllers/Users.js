
const expressAsyncHandler = require('express-async-handler');
const generateToken = require('../middlewear/generateTokens');
const User = require('../models/Users');
const cloudinary=require('../utils/cloudinary')
const {v4: uuidv4} = require('uuid')


// registering a user

const registerUserCtrl = expressAsyncHandler(async (req, res) => {
    const { email, firstName, lastName, password }= req?.body
    const userId = uuidv4()

// generate token
const token=generateToken(userId)

    //find if a user exists

    // const userExists =
    //     await User.findOne({ email });
    // if (userExists) throw new Error('User already exists')




    try {

        // if new, create one
        const user = await User.create({ email, firstName, lastName, password, userId })
        
        const token=generateToken(userId)
        res.json({ user, token})


    } catch (error) {
        res.json({ error })

    }
});



// login user
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists
    const user = await User.findOne({ email });
    console.log(user)
    //Check if password is match
    if (user && (await user?.isPasswordMatch(password))) {
        res.json({

            token: generateToken(user?.userId), user
        });
    } else {
        res.status(401);
        throw new Error("Invalid Login Credentials");
    }
});



// create profile

const createProfileCtrl = expressAsyncHandler(async (req, res) => {
    const id = req?.user?.id
    const filePath = req?.file?.path
      // upload file to cloudinary
      const result = await cloudinary.uploader.upload(filePath)

      // get url of uploaded image
      const image = result?.secure_url;
  console.log(image)
    const {gender, petPreference, children, petOwned, garden, active, about } = req?.body
    
     
    
    const updateDocument = {
        $set: {
             
            gender:gender, 
            petPreference:petPreference, 
            children:children, 
            petOwned:petOwned, 
            garden:garden, 
            active:active, 
            about:about,
            image: image
        },
    }
 
    try {
        
        const user = await User.findByIdAndUpdate(id, updateDocument);
       
        res.json({user })
    } catch (error) {
        
        res.json({ error })
    }
})

// fetch one user

const fetchUserCtrl= expressAsyncHandler (async (req, res)=> {

    const id=req?.user?.id;

    try {
        const user=await User.findById(id)
        res.json({user})
    } catch (error) {
        res.json({ error })
    }
})

const updatePetMatchesCtrl=expressAsyncHandler (async(req, res) => {
    const id=req?.user?.id
    const petId=req?.params?.id

    // check if pet is already matched
    const petMatched= req?.user?.petMatches?.includes(petId)
    if (petMatched) throw new Error('Pet already matched!')
    
    const updateDocument= {
        $push: {petMatches: petId}
    }


    try {
        const user= await User.findByIdAndUpdate(id, updateDocument)
        await user.save()
        console.log(user)
        res.json({user})
    } catch (error) {
        res.json({error})
    }
})
module.exports= {registerUserCtrl,loginUserCtrl,createProfileCtrl, fetchUserCtrl, updatePetMatchesCtrl};