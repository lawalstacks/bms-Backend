const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const genTokenandSetCookie = require('../utils/helpers/genTokenandSetCookie')

const signupUser = async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = await User.findOne({$or:[{email},{username}]});

        if(user) {return res.status(400).json({error:"user already exists"})}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

       await newUser.save();
        if(newUser){
            genTokenandSetCookie(newUser._id,res);
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password

            })
        }else{
            res.status(400).json({error: "invalid user data"})
        }
    }catch (error) {
        res.status(500).json({error: error})
        console.log(error);
    }
}

const loginUser = async (req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPassword =await bcrypt.compare(password,user.password || "");
        if(!user || !isPassword) return res.status(400).json("invalid username or password");
        genTokenandSetCookie(user._id,res);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password

        })
    }catch (error){
        res.status(500).json({error: error})
        console.log(error);
    }
}

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
module.exports = {
    signupUser,
    loginUser,
    logoutUser,
    followUnfollow
}
