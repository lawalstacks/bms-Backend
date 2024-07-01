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
    text:{
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
    contributors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Contributors'
    }]

},{timestamps:true});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;