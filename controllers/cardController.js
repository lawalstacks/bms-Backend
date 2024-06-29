const Card = require('../model/cardModel');
const User = require('../model/userModel')

//creat cards
const create = async (req,res)=> {
    try {
        const {postedBy,title,text,img,video} = req.body;
        const cardExists= await Card.findOne({title});
        if(cardExists){ res.status(400).json({error: "card title already used for another steeze card"})}
        const user = await User.findById(postedBy);
        if (!postedBy || !text || !title) {
            res.status(400).json({error: 'posted by, title and text field are required'});
        }
        if(!user){
            res.status(400).json({error: 'user not found'});
        }
        if(user._id.toString() !==req.user._id.toString() ){
            res.status(400).json({error:"unauthorized to create steeze card"})
            console.log(user.id)
            console.log(req.user.toString())
        }
        const maxLength = 500;
        if(text.length > maxLength){
            res.status(400).json({error: 'maximum text character is 500'});
        }
        const newCard = new Card({
            postedBy,
            title,
            text,
            img,
            video
        })
        await newCard.save();
        if (newCard) {
            await User.findByIdAndUpdate(user._id,{$push:{cards: newCard._id}})
            res.status(201).json(newCard)
            }
    }catch (err){
    }
}

//update card
const update = async (req,res)=>{
    const{postedBy,title,text,image,video} = req.body
    const userId = req.user._id;
    const cardId = req.params.id;
    console.log(cardId)
    try{
        const user = await User.findById(userId);
        let card = await Card.findOne({_id: cardId});
        console.log(card)
        let titleExists = await Card.findOne({$or:[{title}], postedBy:{$ne: userId}})
        if(user._id.toString() !== postedBy.toString()){res.status(400).json({error:"You cannot edit this card"})}
        if(titleExists){res.status(400).json({error:"title already used on another steeze card"})}
        if(!card){res.status(400).json({error:"card not found"})}
            card.title = title || card.title
            card.text = text || card.text;
            card.image = image || card.image;
            card.video = video || video.text;
            card = await card.save();
            res.status(200).json({card: card, message: "updated succesfully"});
    }catch(error){
        res.status(400).json({error:"server error"})
    }
}
const getCard = async(req,res)=>{
    const title = req.params.title;
    try{
        const card = await Card.findOne({title});
        return card ? res.status(200).json({message: card}):  res.status(400).json({error:"card not found"})
    }catch (e) {

    }
}
//delete card




module.exports = {create,update,getCard};