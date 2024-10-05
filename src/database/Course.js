import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  previewVideo: {
    type: String
  },
  title: {
    type: String
  },
  author: {
    type: String
  },
  description: {
    type: String
  },
  courseType: {
    type: String
  },
  price: {
    type: String
  },
  publishedYear: {
    type: String
  },
  courseDuration: {
    type: String
  },
  rating: {
    type: String
  },
  starRating: {
    type: Number
  },
  entrolledStudents: {
    type: Number
  },
  language: {
    type: [String]
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lessons"
    }
  ],
  wishlist_User: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registratedUser"
    }
  ]
});

const Courses = mongoose.model("Courses", Schema);

export default Courses;
