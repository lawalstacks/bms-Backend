const Post = require('../model/postModel');
const User = require('../model/userModel')

//creat posts
const create = async (req,res)=> {
    try {
        const {postedBy,text,img,video} = req.body;
        if (!postedBy || !text) {
            res.status(400).json({error: 'posted by and text field are required'});
        }
        const user = await User.findById(postedBy);
        if(!user){
            res.status(400).json({error: 'user not found'});

        }
        if(user._id.toString() !==req.user._id.toString() ){
            res.status(400).json({error:"unauthorized to create steeze post"})
            console.log(user.id)
            console.log(req.user.toString())
        }
        const maxLength = 500;
        if(text.length > maxLength){
            res.status(400).json({error: 'maximum text character is 500'});
        }
        const newPost = new Post({
            postedBy,
            text,
            img,
            video
        })
        await newPost.save();
        if (newPost) {
            await User.findByIdAndUpdate(user._id,{$push:{posts: newPost._id}})
            res.status(201).json({message:"🤯 steeze card created successfully!"})
        }
    }catch (err){
        console.log(err);
    }
}
//update card
const getPost = async (req,res)=>{

}

//delete card
module.exports = {
    create,
    getPost,
}