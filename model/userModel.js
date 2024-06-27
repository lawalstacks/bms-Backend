const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        default:""
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        minLength: 6,
        required: true
    },
    profilePic:{
        type: String,
        default: ""
    },
    followers:{
        type: [String],
        default:[]
    },
    following:{
        type: [String],
        default:[]
    },
    bio:{
        type: String,
        default: ""
    },
    balance:{
        type: Number,
        default: 0
    },
    cards:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    supporters:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supporter',
    }]
},{timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User;