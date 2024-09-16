const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productName:{
      type: String,
        required: true
    },
    description:{
        type: String,
        maxLength: 500
    },
    slug:{
        type: String,
        unique: true
    },
    img:{
        type: String,
    },
    video:{
        type: String,
    },
    buyer:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    price:{
        type: Number
    }
},{timestamps:true});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Card;