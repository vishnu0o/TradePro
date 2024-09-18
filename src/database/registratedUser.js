import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true
    },
    countryCode:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:false
    },
    status:{
        type:String,
        required:false,
        default:"Active"
    },
    isAdmin:{
        type:Boolean,
        required:false,
        default:false
    }
});

const registratedUser = mongoose.model("registratedUser", Schema);

export default registratedUser;
