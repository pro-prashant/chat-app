
const mongoose = require("mongoose");
const ConnectedDb = async()=>{
            
    try{
              await mongoose.connect(process.env.MONGO_URL);
              console.log("Db is successfully connected");   
    }catch(error){
           console.log("Db is not Connected",error);
    }
}








module.exports = ConnectedDb;
