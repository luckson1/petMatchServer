const mongoose = require('mongoose')
const dotenv=require ('dotenv');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB successfully connected")
    } catch (error) {
        

    }
}



module.exports = dbConnect;