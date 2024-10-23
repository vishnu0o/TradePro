import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  
});

const registratedUser = mongoose.model("registratedUser", Schema);

export default registratedUser;
