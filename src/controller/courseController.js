import asyncHandler from "express-async-handler";
import Courses from "../database/Course.js";
import purchasedCourse from "../database/purshasedCourse.js";
import Lesson from "../database/courseLesson.js";
import Chapter from "../database/courseChapter.js";
import referalLevel from "../database/referalLevelMaster.js";
import referralWallet from "../database/referralWallet.js";
import registratedUser from "../database/registratedUser.js";

// @desc    course find
// @route   get /api/course/findCourse
// @access  user

export const courseFindController = asyncHandler(async (req, res) => {
  try {
    const { pageNumber, userId } = req.query;
    const limit = 5;
    const skipValue = parseInt(pageNumber) * limit;
    const findCourse = await Courses.find({}).limit(limit).skip(skipValue);
    const findPurchasedCourse = await purchasedCourse
      .find({ userId: userId })
      .populate({
        path: "courseId",
        populate: {
          path: "lessons",
          populate: {
            path: "chapters"
          }
        }
      })
      .lean();

    // Add totalChapters and totalQuiz to each course
    if (findPurchasedCourse) {
      findPurchasedCourse.forEach((course) => {
        let totalChapters = 0;
        let totalQuiz = 0;

        // Ensure lessons are present
        if (course.courseId?.lessons && course.courseId?.lessons.length) {
          course.courseId.lessons.forEach((lesson) => {
            // Count the chapters if they exist
            if (lesson.chapters) {
              totalChapters += lesson.chapters.length;
            }

            // Count the quizzes if they exist
            if (lesson.quiz) {
              totalQuiz += lesson.quiz.length;
            }
          });
        }

        // Add new keys to the course object
        course.totalChapters = totalChapters;
        course.totalQuiz = totalQuiz;
      });
    }

    // Now `findPurchasedCourse` contains `totalChapters` and `totalQuiz`
    console.log(findPurchasedCourse);

    res.status(200).json({
      message: "Course find successfully",
      data: {
        allCourses: findCourse,
        purchasedCourses: findPurchasedCourse
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
      quizCount += lesson?.quiz?.length;
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
    console.log(req.body, "reqqqqqqqqqqqqqq");
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

    // variables for level 1 :::::::::::::::::::

    let percentage;
    let coursePrice;
    let walletAmount;

    // variables for level 2 :::::::::::::::::::

    let levelTwopercentage;
    let levelTwocoursePrice;
    let levelTwowalletAmount;

    // Here i try to find the purchasing user details

    const findUser = await registratedUser.findOne({ _id: userId });

    // update course

    const updateCourse = await Courses.updateOne(
      { _id: courseId },
      { $inc: { entrolledStudents: 1 } }
    );

    //  from that find the reffered user
    let findReferralWallet;

    if (findUser?.referredBy) {
      // Level one user :::::::::::

      const level1User = await registratedUser.findOne({
        _id: findUser?.referredBy
      });

      let level2User;

      if (level1User?.referredBy) {
        // Level 2 user :::::::::::::
        level2User = await registratedUser.findOne({
          _id: level1User?.referredBy
        });
      }

      //  Find level master based on the referred User level
      let updateLevel1UserWallet;
      let updateLeve2UserWallet;
      let updateLevel1ReferralBounsDate;
      let updateLevel2ReferralBounsDate;

      if (level1User) {
        // Find level 1 commisssion ::::::::::::
        const findLevelOneCommision = await referalLevel.findOne({
          Level: "Level 1"
        });

        // Find course to get the courseFee

        const findCourse = await Courses.findOne({ _id: courseId });

        // Calculate the wallet income using level commision

        percentage = findLevelOneCommision?.LevelCommission;
        coursePrice = findCourse?.price;
        walletAmount = (parseInt(percentage) / 100) * parseInt(coursePrice);

        updateLevel1UserWallet = await referralWallet.updateOne(
          { userId: level1User?._id, "levels.levelName": "Level 1" },
          {
            $set: {
              "levels.$.levelName": "Level 1"
            },
            $inc: {
              totalIncome: walletAmount,
              "levels.$.levelIncome": walletAmount
            },
            $push: {
              activeUsers: userId,
              "levels.$.activeUsers": userId
            },
            $pull: {
              inActiveUsers: userId,
              "levels.$.inActiveUsers": userId
            }
          },
          { new: true }
        );

        updateLevel1ReferralBounsDate = await referralWallet.updateOne(
          {
            "referralBonusReceivedDate.userId": userId
          },
          {
            $push: {
              "referralBonusReceivedDate.$.date": formattedDate
            }
          }
        );
      }

      if (level2User) {
        const findWallet = await referralWallet.findOne({
          userId: level2User?._id
        });

        // Find level 2 commisssion ::::::::::::

        const findLevelTwoCommision = await referalLevel.findOne({
          Level: "Level 2"
        });

        // Find course to get the courseFee

        const findCourse = await Courses.findOne({ _id: courseId });

        // Calculate the wallet income using level commision

        levelTwopercentage = findLevelTwoCommision?.LevelCommission;
        levelTwocoursePrice = findCourse?.price;
        levelTwowalletAmount =
          (parseInt(levelTwopercentage) / 100) * parseInt(levelTwocoursePrice);

        if (findWallet.activeUsers.length >= 2) {
          updateLeve2UserWallet = await referralWallet.updateOne(
            { userId: level2User?._id, "levels.levelName": "Level 2" },
            {
              $set: {
                "levels.$.levelName": "Level 2",
                "levels.$.visibility": true
              },
              $inc: {
                totalIncome: levelTwowalletAmount,
                "levels.$.levelIncome": levelTwowalletAmount
              },
              $push: {
                activeUsers: userId,
                "levels.$.activeUsers": userId
              },
              $pull: {
                inActiveUsers: userId,
                "levels.$.inActiveUsers": userId
              }
            },
            { new: true }
          );
          updateLevel1ReferralBounsDate = await referralWallet.updateOne(
            {
              "referralBonusReceivedDate.userId": userId
            },
            {
              $push: {
                "referralBonusReceivedDate.$.date": formattedDate
              }
            }
          );
        } else {
          updateLeve2UserWallet = await referralWallet.updateOne(
            { userId: level2User?._id, "levels.levelName": "Level 2" },
            {
              $set: {
                "levels.$.levelName": "Level 2",
                "levels.$.visibility": false
              },
              $inc: {
                totalIncome: levelTwowalletAmount,
                "levels.$.levelIncome": levelTwowalletAmount
              },
              $push: {
                activeUsers: userId,
                "levels.$.activeUsers": userId
              },
              $pull: {
                inActiveUsers: userId,
                "levels.$.inActiveUsers": userId
              }
            },
            { new: true }
          );
          updateLevel1ReferralBounsDate = await referralWallet.updateOne(
            {
              "referralBonusReceivedDate.userId": userId
            },
            {
              $push: {
                "referralBonusReceivedDate.$.date": formattedDate
              }
            }
          );
        }
      } 
    }

    if (!isPurchasedCourseExist) {
      const checkOut = await purchasedCourse.create({
        userId: userId,
        language: language,
        courseId: courseId,
        paymentId: paymentId,
        purchasedAt: formattedDate
      });

      const updateUser = await registratedUser.updateOne(
        { _id: userId },
        {
          $set: {
            isPurchased: true
          }
        }
      );

      res.status(200).json({
        message: "Course purchased successfully",
        status: findReferralWallet
      });
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
        $addToSet: { isPlayedChapters: chapterId }
      }
    );

    if (updateIsChapterPlayed.modifiedCount > 0) {
      res
        .status(200)
        .json({ message: "Chapter marked as played successfully" });
    } else {
      res.status(404).json({ message: "Chapter already isPlayed" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    Course Rating api
// @route   post /api/course/courseRating
// @access  user

export const courseRatingController = asyncHandler(async (req, res) => {
  try {
    const { courseId, rating } = req.body;

    const findAndUpdateCourse = await Courses.findOneAndUpdate(
      { _id: courseId },
      {
        $inc: { rating: 1 },
        $set: { starRating: rating }
      },
      { new: true }
    );

    if (!findAndUpdateCourse) {
      return res
        .status(404)
        .json({ message: "Course not found", status: false });
    }

    res
      .status(200)
      .json({ message: "Your rating added successfully", status: true });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
