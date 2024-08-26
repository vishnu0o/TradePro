import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const registratedUser = mongoose.model("registratedUser", Schema);

export default registratedUser;
