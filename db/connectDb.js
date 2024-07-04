const mongooose = require('mongoose');

const connectDb = async ()=>{
    try{
        mongooose.set('strictQuery',false);
      const conn = await mongooose.connect(process.env.MONGO_URL,{
        useUnifiedTopology: true
      });
       console.log(`database connected !@${conn.connection.host}`)
    }catch (e) {
        console.log('unable to connect');
    }
}
module.exports = connectDb;