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
    res
      .status(200)
      .json({
        message: "Course find successfully",
        data: findCourse,
        status: true
      });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
