require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const connectDb = require('./db/connectDb');
const cors = require('cors');
const PORT = process.env.PORT;
//connect database
connectDb();



//built in middleware
const app = express();
app.use(cors());
app.use(express.json())

app.use('/api', require('./routes/userRoutes'));

app.listen(PORT,()=>{
    console.log(`connected on port: ${PORT}`);
})
