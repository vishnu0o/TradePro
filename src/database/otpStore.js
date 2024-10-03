import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  otp: {
    type: String,
  },
  
});

const OtpStore = mongoose.model("otpStore", Schema);

export default OtpStore;
