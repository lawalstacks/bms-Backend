const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const genTokenandSetCookie = require('../utils/helpers/genTokenandSetCookie')


//signup
const googleAuth = async(req,res)=> {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
   console.log("working")
    res.redirect(url);
}

const googleCallback = async(req,res) =>{
    const {code} = req.query;
    try{
        const {data} = await axios.post('<https://oauth2.googleapis.com/token>', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            redirect_uri: process.env.REDIRECT_URI,
            grantType: 'authorization_code',
        });

        const {access_token, id_token} = data;
         const {data: profile} = await axios.get('<https://accounts.google.com/o/oauth2/v1/userinfo>', {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        console.log(profile);
         return res.status(200).json({message:profile});
            /*const username = profile.given_name;
            const name = profile.given_name + profile.family_name;
            const email =profile.email;
            const profilePic = profile.picture;

            const alreadyExist = await User.findOne({ email })

            if (alreadyExist) {
              return  res.send(200).json({alreadyExist,message:"Login Successful"})
            }
            const newUserGoogle = await User.create({ username, name, email, profilePic: profilePic })
            if (newUserGoogle) {
                genTokenandSetCookie(newUserGoogle._id, res);
            }
            res.status(200).json({ newUserGoogle, message: "signed up successfully" })
*/
    }catch (e) {
        res.status(400).json({ error: "invalid info" })
    }
}
const signupUser = async (req,res)=>{
        try {
            const { username, email, password } = req.body;
            const user = await User.findOne({ $or: [{ email }, { username }] });

            if (user) {
               return  res.status(400).json({ error: "user already exists" })
            }
            if (!username || !email || password.length < 6) {
               return res.status(400).json({ error: "invalid details, password must be 6 " })
            }
            let hashedPassword;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            }

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            })

            await newUser.save();
            if (newUser) {
                genTokenandSetCookie(newUser._id, res);
                res.status(201).json({
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    password: newUser.password,
                    message: `${newUser.username} signed up successfully`
                })
            }
        } catch (error) {
            return res.status(500);
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
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                message: "Login successful"
            })
        } catch (error) {
            res.status(400);
        }
}

//logout
const logoutUser =(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:1});
        res.status(200).json({message: "logout successful!"})

    }catch(err){
        res.status(500).json({error:err})
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
    followUnfollow,
    updateProfile,
    getProfile,
    googleAuth,
    googleCallback
}
