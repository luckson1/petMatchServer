const expressAsyncHandler = require('express-async-handler');
const Pet = require('../models/Pets');
const User = require('../models/Users');
const cloudinary = require("../utils/cloudinary");
require('dotenv').config() 

const createPetProfileCtrl= expressAsyncHandler ( async(req, res)=> {

    const {name, breed, age, gender, petTorrelance, children, petType, garden, active, about } = req?.body
   
    const filePath = req?.file?.path
 
try {
    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(filePath)

    // get url of uploaded image
    const image = result?.secure_url;
    const pet= await Pet.create({name:name, breed:breed, age:age, gender:gender, petTorrelance:petTorrelance, children:children, petType:petType, garden:garden, active:active, about:about,image:image})
    res.json({pet})
} catch (error) {
    res.json({error})
}
    
})


// fetch pets by type (dog or cat)

const fetchPetsByTypeCtrl= expressAsyncHandler (async (req, res) => {

    const petPreference=req?.user?.petPreference

    try {
        const query= {petType: petPreference}
        const pets= await Pet.find(query)
        res.json(pets)
    } catch (error) {
        
        res.json({error})
    }
})


// fetch matched pets

const fetchMatchedPetsCtrl=expressAsyncHandler (async(req,res)=> {
petIds=req?.user?.petMatches
console.log(petIds)
try {
    const pipeline =
    [
        {
            '$match': {
                '_id': {
                    '$in': petIds
                }
            }
        }
    ]
    const foundPets = await Pet.aggregate(pipeline)
    res.json(foundPets)
} catch (error) {
    res.json({error})
}
});


module.exports= {createPetProfileCtrl, fetchPetsByTypeCtrl, fetchMatchedPetsCtrl}