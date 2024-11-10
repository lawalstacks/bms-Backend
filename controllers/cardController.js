const Card = require('../model/cardModel');
const User = require('../model/userModel');
const Slug = require('slugify-mongodb');
const cloudinary = require('cloudinary').v2

//creat cards
const create = async (req,res)=> {
    const {postedBy, title,details,color,goalAmount,fileType} = req.body
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
                media = uploadedResponse.secure_url;

                // Optimize delivery by resizing and applying auto-format and auto-quality
        }
        let slug = Slug.slugify(title);
        const newCard = new Card({
            postedBy,
            title,
            slug,
            details,
            media,
            fileType,
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
    const{title, details,color,goalAmount,} = req.body;
    let {media} = req.body;
    const userId = req.user._id;
    const cardId = req.params.id;
    try{
        const user = await User.findById(userId);
        let card = await Card.findOne({_id: cardId});
        if(user._id.toString() !== card.postedBy?.toString())
        {
            return res.status(400).json({error:"You cannot edit this card"})
        }
        if(!card){
            return res.status(400).json({error:"card not found"})
        }
        if(media){
            if(card?.media){
                cloudinary.uploader.destroy(card?.media.split('/').pop().split('.')[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(media, {
                public_id: "cardMedia",
                resource_type: 'auto',
                timeout: 600000,
                chunk_size: 6000000
            }, function(error, result) {

            });
            media = uploadedResponse.secure_url;
            // Optimize delivery by resizing and applying auto-format and auto-quality
        }
        let slug = Slug.slugify(title);
            await User.findOneAndUpdate(
              { _id: userId, 'cards._id': cardId }, // Find user and card
              {
                  $set: {
                      'cards.$.title': title || card.title,
                      'cards.$.details': details || card.details,
                      'cards.$.slug': slug,
                      'cards.$.media': media || card.media,
                      'cards.$.color': color || card.color,
                      'cards.$.goalAmount': goalAmount || card.goalAmount
                  }
              },
              { new: true }
            )
            await Card.findByIdAndUpdate(cardId,{$push: {cards: card }})
           res.status(200).json({card: card, message: "updated succesfully"});
    }catch(error){
        console.log(error)
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