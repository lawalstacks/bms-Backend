const Card = require('../model/cardModel');
const User = require('../model/userModel');
const Slug = require('slugify-mongodb');
const cloudinary = require('cloudinary').v2

//creat cards
const create = async (req,res)=> {
    const {postedBy, title,details,color,goalAmount} = req.body
    let {media} = req.body;
    let optimizeUrl;
    try {
        if (!title) {
           return res.status(400).json({error: 'posted by, title and text field are required'});
        }
        const user = await User.findById(postedBy);
        if (!user) {
         return   res.status(400).json({error: 'user not found'});
        }
        if (user._id.toString() !== req.user._id.toString()) {
           return res.status(400).json({error: "unauthorized to create steeze post"})
        }
        const maxLength = 100;
        if (details?.length > maxLength) {
            return res.status(400).json({error: 'maximum text character is 500'});
        }
        if(media){

            if(user.media){
                cloudinary.uploader.destroy(user.media.split('/').pop().split('.')[0]);
            }
                const uploadedResponse = await cloudinary.uploader.upload(media, {
                    public_id: "cardMedia",
                    resource_type: 'auto',
                    timeout: 600000,
                    chunk_size: 6000000
                }, function(error, result) {

                });
                media = uploadedResponse.secure_url
                // Optimize delivery by resizing and applying auto-format and auto-quality
        }
        let slug = Slug.slugify(title);
        const newCard = new Card({
            postedBy,
            title,
            slug,
            details,
            media: media || "",
            color,
            goalAmount,
        })
        await newCard.save();
        await User.findByIdAndUpdate(user._id, {$push: {cards: newCard}})
        console.log(newCard)
        res.status(200).json({
            success: true,
            message:"Card created successfully!😍"
        ,user:{
                ...user._doc
            }

        })
    } catch (error) {
        if(error.code === 11000){
            res.status(500).json({error: "title already used on another steeze card"})
        }else {
            console.log(error)
            res.status(500);
        }
    }
}
//update card
const update = async (req,res)=>{
    const{postedBy,text,image,video} = req.body;
    let {title,slug} = req.body;
    const userId = req.user._id;
    const cardId = req.params.id;
    try{
        const user = await User.findById(userId);
        let card = await Card.findOne({_id: cardId});
        if(user._id.toString() !== postedBy.toString()){res.status(400).json({error:"You cannot edit this card"})}
        if(!card){res.status(400).json({error:"card not found"})}
         else {
            slug = Slug.slugify(title);
            card.title = title || card.title
            card.text = text || card.text;
            card.slug = slug || card.slug;
            card.image = image || card.image;
            card.video = video || video.text;
            card = await card.save();
            res.status(200).json({card: card, message: "updated succesfully"});
        }
    }catch(error){
        if(error.code=== 11000){
            { res.status(400).json({message: "card title already used"})}
        }
    }
}
const getCard = async(req,res)=>{
    const slug = req.params.slug;
    try{
        const card = await Card.findOne({slug});
        return card ? res.status(200).json({message: card}):  res.status(400).json({error:"card not found"})
    }catch (e) {
        console.log(e)
    }
}
//delete card
const deleteCard = async (req,res)=>{
    try {
        const slug = req.params.slug
        const card = await Card.findOne({slug});
        if(!card){res.status(400).json(({message:"card not found"}))}
        if(req.user._id.toString() !== card.postedBy.toString()){
            res.status(400).json({error:"you cannot delete this card"})
            return;
        }
        await Card.findOneAndDelete({slug: slug});
        await User.findByIdAndUpdate(card.postedBy, {$pull: {cards: post._id}})

        res.status(200).json({message: 'card deleted successfully'});
    } catch (error) {

        if(error.code ==='ERR_HTTP_HEADERS_SENT'){
            return;
        }
    }
}


module.exports = {create,update,getCard,deleteCard};