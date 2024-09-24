const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
      type: String,
        required: true
    },
    details:{
        type: String,
        maxLength: 500
    },
    slug:{
        type: String,
        unique: true
    },
    media:{
        type: String,
    },
    fileType:{
      type: String
    },
    contributors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Contributors'
    }],
    color:{
        type: String
    },
    goalAmount:{
        type: Number
    },
},{timestamps:true});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;