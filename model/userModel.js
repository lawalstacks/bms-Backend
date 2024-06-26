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
    bio:{
        type: String,
        default: ""
    }
},{timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User;