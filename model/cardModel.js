const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        maxLength: 500
    },
    img:{
        type: String,
    },
    video:{
        type: String,
    },

},{timestamps:true});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;