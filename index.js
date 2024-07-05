require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const connectDb = require('./db/connectDb');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('./utils/helpers/passport-setup');

const PORT = process.env.PORT||3000;
//connect database
connectDb();

//built in middleware
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/auth', require('./routes/socialRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api/card',require('./routes/cardRoutes'));
app.use('/api/post',require('./routes/postRoutes'));


app.listen(PORT,()=>{
    console.log(`connected on port: ${PORT}`);
})
