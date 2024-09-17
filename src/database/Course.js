import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  previewVideo: {
    type: String,
  },
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  description: {
    type: String,
  },
  courseType: {
    type: String,
  },
  price:{
    type:String
  },
  publishedYear:{
    type:String
  },
  courseDuration:{
    type:String
  },
  rating:{
    type:String
  },
  starRating:{
    type:Number
  },
  entrolledStudents:{
    type:Number
  },
  language: {
    type: [String],
  },
  lessons: {
    type: [
      {
        lessonName: {
          type: String,
        },
        chapters: [
          {
            title: {
              type: String,
            },
            video: {
              type: String,
            },
            quiz: [
              {
                question: {
                  type: String,
                },
                options: [String],
                answer: {
                  type: String,
                },
              },
            ],
          },
        ],
      },
    ],
  },
});

const Courses = mongoose.model("Courses", Schema);

export default Courses;
