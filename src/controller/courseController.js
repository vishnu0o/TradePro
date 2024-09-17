import asyncHandler from "express-async-handler";
import Courses from "../database/Course.js";

// @desc    course find
// @route   get /api/course/findCourse
// @access  user

export const courseFindController = asyncHandler(async (req, res) => {
  try {
    const { pageNumber } = req.query;
    const limit = 5;
    const skipValue = parseInt(pageNumber) * limit;
    const findCourse = await Courses.find({}).limit(limit).skip(skipValue);
    res.status(200).json({
      message: "Course find successfully",
      data: findCourse,
      status: true
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    course findOne
// @route   get /api/course/findOneCourse
// @access  user

export const courseFindOneController = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query;

    const findCourse = await Courses.findOne({ _id: id });

    if (!findCourse) {
      return res.status(404).json({
        message: "Course not found",
        status: false
      });
    }

    let numberOfVideos = 0;
    let quizCount = 0;

    findCourse.lessons.forEach(lesson => {
      numberOfVideos += lesson.chapters.length;
      lesson.chapters.forEach(chapter => {
        quizCount += chapter.quiz.length;
      });
    });

    res.status(200).json({
      message: "Course found successfully",
      data: {
        ...findCourse.toObject(),
        numberOfVideos, 
        quizCount   
      },
      status: true
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

