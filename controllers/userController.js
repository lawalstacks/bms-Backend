const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const axios = require('axios');
const genTokenandSetCookie = require('../utils/helpers/genTokenandSetCookie');
const sendEmail = require('../mailtrap/emails');
const { sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../mailtrap/emails');


//signup
const loginUser = async(req, res) => {
  if(req.body.googleAccessToken){
    // gogole-auth
    const {googleAccessToken} = req.body;
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          "Authorization": `Bearer ${googleAccessToken}`
        }
      })
      .then(async response => {
        const name = response.data.given_name + " " + response.data.family_name;
        const username = response.data.given_name;
        const email = response.data.email;
        const picture = response.data.picture;
        const user = await User.findOne({email})
        if (!user) {
          return res.status(400).json({ error: "User don't exist!" })
        }
        genTokenandSetCookie(user._id, res);
        user.lastLogin =new Date();
        await user.save();
        res.status(201).json({
          success: true,
          message:"Logged in successfully",
          user:{
            ...user._doc,
            password: undefined,
          }
        })
      })
      .catch(err => {
        res
          .status(400)
          .json({error: "Invalid access token!"})
      })
  }else{
    // normal-auth
    const {email, password} = req.body;
    if (email === "" || password === "") {
      return res.status(400).json({ error: "Invalid field!" });
    }
    try {
      const user = await User.findOne({ email })
      if (!user) {
       return res.status(400).json({ error: "User don't exist!" })
      }
      genTokenandSetCookie(user._id, res);
      user.lastLogin = new Date();
      await user.save();
      res.status(201).json({
        success: true,
        message: "Logged in successfully",
        user: {
          ...user._doc,
          password: undefined,
        }
      })
    }catch(error){
      console.log(error)
    }
    }
  }

const signupUser = async(req, res) => {
  if (req.body.googleAccessToken) {
    const {googleAccessToken} = req.body;
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          "Authorization": `Bearer ${googleAccessToken}`
        }
      })
      .then(async response => {
        const username = response.data.given_name +" "+response.data.family_name;
        const email = response.data.email;
        const picture = response.data.picture;
        const isUser = await User.findOne({email})
        if (isUser) {

          return res.status(400).json({ message: "User already exist!" })
        }
        if (username==="" || email==="" || password.length < 6) {
          return res.status(400).json({ error: "invalid details, password must be 6 " })
        }
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = Math.floor(100000 + Math.random()*9000000).toString();
        const user = new User({
          username,
          email,
          password: hashedPassword,
          verificationToken,
          verificationTokenExpiresAt: Date.now()+24 *60 *60 * 1000
        })
        await user.save();
        if (user) {
          genTokenandSetCookie(user._id, res);
          await sendEmail.sendVerificationEmail(user.email, verificationToken)
          res.status(201).json({
            success: true,
            message: `${newUser.username} signed up successfully`,
            newUser:{
              ...user._doc,
              password: undefined,
            }
          })
        }
      })
      .catch(err => {
        res.status(400).json({message: "Invalid access token!"})
      })
  } else {
    // normal form signup
    const {email, password, username} = req.body;
    try {
      if (email === "" || password === ""  || username === "") {
        return res.status(400).json({ message: "Invalid field!" })
      }
      const user = await User.findOne({email})
      if (user) {
        return res.status(400).json({ message: "user already exist!" })
      }
      if (username==="" || email==="" || password.length < 6) {
        return res.status(400).json({ error: "invalid details, password must be 6 " })
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
      const verificationToken = Math.floor(100000 + Math.random()*9000000).toString();
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now()+24 *60 *60 * 1000
      })
      await newUser.save();
      if (newUser) {
        genTokenandSetCookie(newUser._id, res);
        await sendEmail.sendVerificationEmail(newUser.email, verificationToken)
        res.status(201).json({
          success: true,
          message: `${newUser.username} signed up successfully`,
          newUser:{
            ...newUser._doc,
            password: undefined,
          }
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(400);
    }
  }
}

/*const signupUser = async (req,res)=>{
        try {
            const { username, email, password } = req.body;
            const user = await User.findOne({ email});
           // const emailExist = await User.findOne({email});
            if (user) {
              console.log(user);
               return  res.status(400).json({ error: "username already exists" })
            }
            if (username==="" || email==="" || password.length < 6) {
               return res.status(400).json({ error: "invalid details, password must be 6 " })
            }

            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
            const verificationToken = Math.floor(100000 + Math.random()*9000000).toString();

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
              verificationToken,
              verificationTokenExpiresAt: Date.now()+24 *60 *60 * 1000
            })
            await newUser.save();
            if (newUser) {
                genTokenandSetCookie(newUser._id, res);
               await sendEmail.sendVerificationEmail(newUser.email, verificationToken)
               res.status(201).json({
                 success: true,
                 message: `${newUser.username} signed up successfully`,
                 newUser:{
                      ...newUser._doc,
                   password: undefined,
                 }
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(400);
          }
}

//login
const loginUser = async (req,res)=>{
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            const isPassword = await bcrypt.compare(password, user?.password || "");
            if (!user || !isPassword) {
                return res.status(400).json({ error: "invalid login details" })
            }
            genTokenandSetCookie(user._id, res);

            user.lastLogin =new Date();
            await user.save();
            res.status(201).json({
                success: true,
              message:"Logged in successfully",
                user:{
                  ...user._doc,
                  password: undefined,
                }
            })
        } catch (error) {
            res.status(400);
        }
}
*/
//logout
const logoutUser =(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:1});
        res.status(200).json({message: "logout successful!"})

    }catch(err){
        res.status(500).json({error:err})
    }
}

const verifyEmail = async (req,res)=>{
  const {code} = req.body;
  try{
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: {$gt: Date.now()}
    })
    if(!user){
      return res.status(400).json({success: false, message:"Invalid or expired verification code"})
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email,user.username)
    res.status(201).json({
      success: true,
      message:"Email verified successfully",
      user:{
        ...user._doc,
        isVerified: true,
        password: undefined,
      }
    })
  }catch (error){
    console.log(error)
  }
}

const forgotPassword = async (req,res) =>{
  const {email} = req.body;
  try{
    const user = await User.findOne({email})
  if(!user){
    return res.status(400).json({success: false, message:"user not found"});
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiresAt = Date.now() + 1 * 60  * 60 * 1000;

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = resetTokenExpiresAt;

  await user.save();

  // SEND EMAIL
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
  res.status(200).json({message:"Password reset link has been sent to your email"});
  }catch (error) {
    console.log("error in forgot password", error);
    res.status(400).json({success: false, message: error.message});
    console.log(error)
  }
}
 const resetPassword = async (req,res)=>{
  try{
    const {token} = req.params;
    const {password} = req.body;
    const user = await User.findOne({
      resetPasswordToken:token,
      resetPasswordExpiresAt:{$gt: Date.now()}})
    if(!user){
      return res.status(400).json({message:"invalid reset token"})
    }
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken =undefined;
    user.resetPasswordExpiresAt=undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res.status(200).json({message:"Password reset successfull", user:{
      ...user._doc,
        password: undefined
      }})
  }catch (e) {
console.log(e);
  }
 }
//followunfollow
const followUnfollow = async (req,res)=>{
    try{
        const {id} = req.params;
        const usertoFollow = await User.findById(id);
        const userFollowing = req.user;
        if(!usertoFollow){
            res.status(400).json({error:"user not found"});
        }
        if(usertoFollow._id.toString() === userFollowing._id.toString()){
            res.status(400).json({error: "you cannot follow your self"})
        }

        const isFollowing = await userFollowing.following.includes(id);
        if(isFollowing){
            await User.findByIdAndUpdate(req.user._id,{$pull: {following: id }})
            await User.findByIdAndUpdate(usertoFollow._id, {$pull: {followers: req.user._id}})
            res.status(200).json({message:"user unfollowed successfully"})
        }else{
            await User.findByIdAndUpdate(req.user._id,{$push: {following: id }})
            await User.findByIdAndUpdate(usertoFollow._id, {$push: {followers: req.user._id}})
            res.status(201).json({message:"user followed successfully"});
        }



    }catch(err){
        res.status(500).json({error: "error to follow/unfollow"})
    }
}

//updateProfile
const updateProfile= async (req,res)=>{
    const {name,username,email,password,bio,profilePic} = req.body
    const userId = req.user._id;
    try{
        let user = await User.findById(userId);
        if(!user){  res.status(400).json({error:"user not found"})}
        if(req.params.id  !== userId.toString()){res.status(400).json({error:"you annot update other users profile"})}
        let userExists= await User.findOne({$or:[{email},{username}], _id:{$ne: userId}});
        if(userExists){ res.status(200).json({message: "username / email already used"})}
            user.name = name || user.name;
            user.username = username || user.username
            user.email = email || user.email
            user.bio = bio || user.bio
            user.profilePic = profilePic || user.profilePic
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword;
            }
            user = await user.save()
            res.status(201).json({user,message:"profile updated!"})

    }catch(error){
        res.status(500).json({error:error})
        console.log(error)
    }
}

//getProfile
const getProfile = async (req,res) =>{
    try{
        const username = req.params.username
        const user = await User.findOne({username}).select("-password");
        return user ? res.status(200).json({message: user}):  res.status(400).json({error:"user not found"})

    }catch (error) {
        res.status(400).json({message: "server error"})
        console.log(error)
    }
}

module.exports = {
    signupUser,
    loginUser,
    logoutUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    followUnfollow,
    updateProfile,
    getProfile,

}
