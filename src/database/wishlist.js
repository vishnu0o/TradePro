import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true
  },
  language: {
    type: String,
    required: true
  },
  userId: {
    type: String
  },
 
});

const wishlist = mongoose.model("wishlist", wishlistSchema);
export default wishlist;
