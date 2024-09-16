require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const connectDb = require('./db/connectDb');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2


const PORT = process.env.PORT || 8080 ;
//connect database
connectDb();
cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET
})

//built in middleware
const app = express();
const corsOptions ={
  origin:['http://localhost:5173'],
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true,limit:"50mb"}));
app.use(cookieParser());

app.use('/api', require('./routes/userRoutes'));
app.use('/api/card',require('./routes/cardRoutes'));
app.use('/api/post',require('./routes/postRoutes'));


app.listen(PORT,()=>{
    console.log(`connected on port: ${PORT}`);
})
