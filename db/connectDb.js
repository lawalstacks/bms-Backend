const mongooose = require('mongoose');

const connectDb = async ()=>{
    try{
        mongooose.set('strictQuery',false);
        const db = process.env.MONGO_URL;
       await mongooose.connect(db);
       console.log(`database connected !`)
    }catch (e) {
        console.log('unable to connect');
    }
}
module.exports = connectDb;