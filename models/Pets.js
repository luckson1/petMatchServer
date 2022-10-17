const mongoose = require('mongoose')

const petSchema = new mongoose.Schema(
    {
      
        image: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },     
        breed: {
            type: String,
            required: true,
        },     
        
       petAge: {
           type:String,
           required:true,
       },
        gender: {
            type: String,
            required: true,
        },
        petTorrelance: {
            type: String,
            required: true,
        },
        children: {
            type: String,
            required: true,
        },
        petType: {
            type: String,
            required: true,
        },
        garden: {
            type: String,
            required: true,
        },
        active: {
            type: String,
            required: true,
        },
        about: {
            type: String,
            required: true,
        },
      

    },
    {
        timestamps: true,
    }
);


const Pet = mongoose.model("Pet", petSchema);
module.exports = Pet;