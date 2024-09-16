const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        default:""
    },
    username:{
        type: String,
        required: true,
        unique:true

    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        minLength: 6,
        required: true
    },
    googleId:{
        type: String
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
    cards:[
      {
          cardId:{
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Card',
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
          contributors:[{
              type:mongoose.Schema.Types.ObjectId,
              ref: 'Contributors'
          }],
          color:{
              type: String
          },
          goalAmount:{
              type: Number
          }
      },{createdAt:Date }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    supporters:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supporter',
    }],
    isVerified:{
        type: Boolean,
        default: false
    },
    lastLogin:{
      type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
},{timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User;