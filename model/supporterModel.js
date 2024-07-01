moonoose = require('mongoose');


const supporterModel = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: false
    },
    message:{
        type: String,
        required: false
    }
},{timestamps: true})

const Supporter = mongoose.model('Supporter',supporterModel);

module.exports = Supporter;