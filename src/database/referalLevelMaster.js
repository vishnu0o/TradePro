import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    Level:{
        type:String,
        required:true 
    },
    LevelCommission:{
        type:String,
        required:true
    },
   
});

const referalLevel = mongoose.model("referalLevel", Schema);

export default referalLevel;
