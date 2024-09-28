import asyncHandler from "express-async-handler";
import Courses from "../database/Course.js";
import purchasedCourse from "../database/purshasedCourse.js";
import Lesson from "../database/courseLesson.js";
import Chapter from "../database/courseChapter.js";

// @desc    course find
// @route   get /api/course/findCourse
// @access  user

export const courseFindController = asyncHandler(async (req, res) => {
  try {
    const { pageNumber, userId } = req.query;
    const limit = 5;
    const skipValue = parseInt(pageNumber) * limit;
    const findCourse = await Courses.find({}).limit(limit).skip(skipValue);
    const findPurchasedCourse = await purchasedCourse.findOne({
      userId: userId
    });
    const findCourseFromPurchasedCourse = await Courses.find({
      _id: findPurchasedCourse?.courseId
    });
    res.status(200).json({
      message: "Course find successfully",
      data: {
        allCourses: findCourse,
        purchasedCourses: findCourseFromPurchasedCourse
      },
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

    const findCourse = await Courses.findOne({ _id: id })
      .populate({
        path: "lessons",
        populate: {
          path: "chapters"
        }
      })
      .exec();
    if (!findCourse) {
      return res.status(404).json({
        message: "Course not found",
        status: false
      });
    }

    let numberOfVideos = 0;
    let quizCount = 0;

    findCourse.lessons.forEach((lesson) => {
      numberOfVideos += lesson.chapters.length;
      lesson.chapters.forEach((chapter) => {
        quizCount += chapter?.quiz?.length;
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

// @desc    checkout
// @route   get /api/course/checkout
// @access  user

export const checkOutController = asyncHandler(async (req, res) => {
  try {
    const { userId, language, courseId, paymentId } = req.body;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const isPurchasedCourseExist = await purchasedCourse.findOne({
      userId: userId,
      courseId: courseId
    });
    if (!isPurchasedCourseExist) {
      const checkOut = await purchasedCourse.create({
        userId: userId,
        language: language,
        courseId: courseId,
        paymentId: paymentId,
        purchasedAt: formattedDate
      });
      res
        .status(200)
        .json({ message: "Course purchased successfully", status: true });
    } else {
      res.status(409).json({ message: "Course already exist", status: true });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    Chapter isPlayed api
// @route   get /api/course/chapterIsPlayed
// @access  user

export const chapterIsPlayedController = asyncHandler(async (req, res) => {
  try {
    const { purchasedId, chapterId } = req.body;
    const updateIsChapterPlayed = await purchasedCourse.updateOne(
      { _id: purchasedId },
      {
        $push: { isPlayedChapters: chapterId }
      }
    );

    if (updateIsChapterPlayed.modifiedCount > 0) {
      res
        .status(200)
        .json({ message: "Chapter marked as played successfully" });
    } else {
      res.status(404).json({ message: "No matching record found to update" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
