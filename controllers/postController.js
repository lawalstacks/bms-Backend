const Post = require('../model/postModel');
const User = require('../model/userModel');
const Slug = require('slugify-mongodb');

//creat posts
const create = async (req,res)=> {
    const {postedBy, text, title, img, video} = req.body
    try {
        if (!postedBy || !text || !title) {
            res.status(400).json({error: 'posted by, title and text field are required'});
        }
        const user = await User.findById(postedBy);
        if (!user) {
            res.status(400).json({error: 'user not found'});
        }
        if (user._id.toString() !== req.user._id.toString()) {
            res.status(400).json({error: "unauthorized to create steeze post"})
            return;
        }
        const maxLength = 500;
        if (text.length > maxLength) {
            res.status(400).json({error: 'maximum text character is 500'});
        }
        let slug = await Slug.generateUniqueSlug(title,Post);
        const newPost = new Post({
            postedBy,
            title,
            slug,
            text,
            img,
            video
        })
            await newPost.save();
            await User.findByIdAndUpdate(user._id, {$push: {posts: newPost}})
            res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({error: "unable to create post"})
        console.log(error)
    }
}
//update post
const update = async (req,res)=>{
    const{postedBy,title,text,image,video} = req.body;
    const userId = req.user._id;
    const postId = req.params.id;
    try{
        const user = await User.findById(userId);
        let post = await Post.findById(postId);
        if(user._id.toString() !== postedBy.toString()){res.status(400).json({error:"You cannot edit this post"})}
        if(!post){res.status(400).json({error:"post not found"})}
        let slug = await Slug.generateUniqueSlug(title,Post);
        console.log(slug)
        post.postedBy = postedBy
        post.text = text || post.text;
        post.title = title || post.title;
        post.slug = slug || post.slug;
        post.image = image || post.image;
        post.video = video || post.text;
        post = await post.save();
        res.status(200).json({post:post,message:"updated successfully"});
    }catch(error){
        res.status(400);
    }
}

//get Post
const getPost = async (req,res)=>{
    const slug = req.params.slug;
    try{
        const post = await Post.findOne({slug});
        return post ? res.status(200).json({message: post}):  res.status(400).json({error:"post not found"})
    }catch (e) {
        res.status(400);
    }
}

//delete card
const deletePost = async (req,res)=> {
    try {
        const slug = req.params.slug
        const post = await Post.findOne({slug});
        if(!post){res.status(400).json(({message:"post not found"}))}
        if(req.user._id.toString() !== post.postedBy.toString()){
            res.status(400).json({error:"you cannot delete this post"})
            return;
        }
        await Post.findOneAndDelete({slug: slug});
        await User.findByIdAndUpdate(post.postedBy, {$pull: {posts: post._id}})
        res.status(200).json({message: 'post deleted successfully'});
    } catch (error) {
        if(error.code ==='ERR_HTTP_HEADERS_SENT'){
            return;
        }
    }
}

//like unlike post
const likeUnlikePost = async (req,res)=>{
try {
    const slug = req.params.slug;
    const post = await Post.findOne({slug});
    console.log(post)
    if(!post){res.status(400).json({error: "post not found"})}
    const user = await User.findById(post.postedBy);
    const isLiking = await post.likes.includes(user._id);
    if(!isLiking){
        await Post.findByIdAndUpdate(post._id,{$push: {likes: user}})
            res.status(200).json({message:"post unliked successfully"})
    }else{
        await Post.findByIdAndUpdate(post._id,{$pull: {likes: user._id }})
        res.status(200).json({message:"post liked successfully"})
    }
}catch(error){
console.log(error)
}
}
module.exports = {
    create,
    update,
    getPost,
    deletePost,
    likeUnlikePost
}