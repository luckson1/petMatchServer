const express=require('express')
const app=express()
const cors = require("cors");
const dbConnect = require('./dbConnect');
const { notFound, errorHandler } = require('./middlewear/errors');

const dotenv=require ('dotenv');
const { userRoutes } = require('./routes/Users');
const { petRoutes } = require('./routes/Pets');
const { donerRoutes } = require('./routes/Doners');


// allow our node process to have access to the environment variables
dotenv.config()

//connect to Database
dbConnect()


// heroku connection message
app.get("/",(req, res)=> {
    res.json({msg: "welcome!"})
})
// middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// routes

//users routes
app.use('/api/users', userRoutes)

//pets routes
app.use('/api/pets', petRoutes)

//doners routes
app.use('/api/doners', donerRoutes)


//error handling //  

app.use(notFound);
app.use(errorHandler);


module.exports=app;