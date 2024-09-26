import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lessons",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  video: {
    type: String
  },
  isPlayed:{
    type:Boolean,
    default:false
  }
});

const Chapter = mongoose.model("Chapters", ChapterSchema);
export default Chapter;
