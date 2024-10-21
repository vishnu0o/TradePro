import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import registratedUser from "../database/registratedUser.js";
import { uploadFileToS3 } from "../utils/S3Upload.js";
import fs from "fs";
import wishlist from "../database/wishlist.js";
import Courses from "../database/Course.js";
import referralWallet from "../database/referralWallet.js";

// @desc    profile find
// @route   get /api/settings/findProfile
// @access  user

export const profileFindController = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    const findProfile = await registratedUser.findOne({ _id: userId });
    if (findProfile) {
      res.status(200).json({
        message: "Profile find successfully",
        data: findProfile,
        status: true
      });
    } else {
      res.status(404).json({ message: "Profile not find", status: false });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    profile update
// @route   get /api/settings/updateProfile
// @access  user

export const profileUpdateController = asyncHandler(async (req, res) => {
  try {
    const formData = req.body;
    console.log(formData, "formDataaaaaaaaaaaaaaaaaaaa");
    let uploadedProfileImageUrl;
    if (req.file) {
      const fileData = fs.readFileSync(req.file.path);
      const fileName = `TradeProProfileImage${req.file.filename}`;
      const folderName = "ProfileImage";
      const contentType = req.file.mimetype;
      uploadedProfileImageUrl = await uploadFileToS3(
        fileData,
        fileName,
        folderName,
        contentType
      );

      // Remove the file from the local filesystem after successful upload
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting the file from local storage:", err);
        } else {
          console.log("File deleted from local storage successfully");
        }
      });
    }

    console.log(
      uploadedProfileImageUrl,
      "uploadedProfileImageUrluploadedProfileImageUrl"
    );

    const updateProfile = await registratedUser.updateOne(
      { _id: formData?.userId },
      {
        $set: {
          name: formData?.name,
          email: formData?.email,
          countryCode: formData?.countryCode,
          phoneNumber: formData?.phoneNumber,
          isNotification: formData?.isNotification,
          profileImage: uploadedProfileImageUrl
            ? uploadedProfileImageUrl
            : formData?.profileImage
        }
      }
    );

    if (updateProfile) {
      res.status(200).json({
        message: "Profile update successfully",
        status: true
      });
    } else {
      res.status(200).json({
        message: "Profile not updated",
        status: true
      });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    wishlist create
// @route   get /api/settings/createWishlist
// @access  user

export const createWishlistController = asyncHandler(async (req, res) => {
  try {
    const { userId, courseId, language } = req.body;

    const isWishListed = await wishlist.findOne({
      courseId: courseId,
      userId: userId
    });

    if (!isWishListed) {
      const findCourse = await Courses.findOne({ _id: courseId });
      const createWishlist = await wishlist.create({
        courseId: courseId,
        language: language,
        userId: userId
      });
      findCourse?.wishlist_User?.push(userId);
      await findCourse.save();
      res.status(200).json({ message: "Added to wishlist successfully" });
    } else {
      res.status(401).json({ message: "Course already wishlisted" });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    wishlist find
// @route   get /api/settings/findWishlist
// @access  user

export const findWishlistcontroller = asyncHandler(async (req, res) => {
  try {
    const findWishlist = await wishlist.find({}).populate("courseId");
    if (findWishlist) {
      res
        .status(200)
        .json({ message: "wishlist find successfully", data: findWishlist });
    } else {
      res.status(200).json({ message: "Something went wrong", status: false });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    wishlist delete
// @route   get /api/settings/removeWishlist
// @access  user

export const removeWishlistcontroller = asyncHandler(async (req, res) => {
  try {
    const {userID, courseID } = req.query;
    const removeWishlist = await wishlist.deleteOne({
      courseId: courseID,
      userId: userID
    });
    await Courses.updateOne(
      { _id: courseID },
      { $pull: { wishlist_User: userID } }
    );
    res.status(200).json({ message: "Delete successfully", status: true });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    referralCode find
// @route   get /api/settings/findReferralCode
// @access  user

export const findReferralController = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  try {
    const findReferralCode = await registratedUser.findOne({
      _id: userId
    });

    res.status(200).json({
      message: "ReferralCode find successfully",
      data: findReferralCode?.referralCode
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    changePassword api
// @route   put /api/settings/changePassword
// @access  user

export const changePasswordController = asyncHandler(async (req, res) => {
  try {
    let { oldPassword, newPassword, userID } = req.body;

    const findUser = await registratedUser.findOne({
      _id: userID
    });
    if (findUser) {
      bcrypt
        .compare(oldPassword, findUser.password)
        .then(async (isMatch) => {
          if (isMatch) {
            newPassword = await bcrypt.hash(newPassword, 10);
            await registratedUser.updateOne(
              { _id: userID },
              {
                $set: {
                  password: newPassword
                }
              }
            );
            res.status(201).send({
              message: "change password successfully",
              status: true
            });
          } else {
            res
              .status(400)
              .json({ message: "Incorrect old password", status: false });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: "Error occurred while comparing passwords",
            status: false
          });
        });
    } else {
      res.status(400).json({ message: "User not exist", status: false });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    wallet find api
// @route   get /api/settings/findWallet
// @access  user

export const findWalletController = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query;
    console.log(req.query, "queryyyyyyyyyyyyyy");
    const findWallet = await referralWallet
      .findOne({ userId: id })
      .populate("totalTeamMembers")
      .populate("activeUsers")
      .populate("inActiveUsers")
      .populate("levels.totalReferrals") 
      .populate("levels.activeUsers")  
      .populate("levels.inActiveUsers");


    const data = {
      _id:findWallet?._id,
      userId:findWallet?.userId,
      totalIncome:findWallet?.totalIncome,
      totalTeamMembers:findWallet?.totalTeamMembers?.length||0,
      activeUsers:findWallet?.activeUsers?.length||0,
      inActiveUsers:findWallet?.inActiveUsers?.length||0,
      level1:{
        levelName:findWallet?.levels[0]?.levelName||"-",
        visibility: findWallet?.levels[0]?.visibility|| false,
        levelIncome:findWallet?.levels[0]?.levelIncome,
        totalReferrals:findWallet?.levels[0]?.totalReferrals?.length||0,
        activeUsers:findWallet?.levels[0]?.activeUsers?.length||0,
        inActiveUsers:findWallet?.levels[0]?.inActiveUsers?.length||0,
        ActiveUserDetails:findWallet?.levels[0]?.activeUsers,
        inActiveUserDetails:findWallet?.levels[0]?.inActiveUsers
      },
      level2:{
        levelName:findWallet?.levels[1]?.levelName||"-",
        visibility: findWallet?.levels[1]?.visibility|| false,
        levelIncome:findWallet?.levels[1]?.levelIncome,
        totalReferrals:findWallet?.levels[1]?.totalReferrals?.length||0,
        activeUsers:findWallet?.levels[1]?.activeUsers?.length||0,
        inActiveUsers:findWallet?.levels[1]?.inActiveUsers?.length||0,
        ActiveUserDetails:findWallet?.levels[1]?.activeUsers,
        inActiveUserDetails:findWallet?.levels[1]?.inActiveUsers
      }

    }

    console.log(findWallet, "findWalletfindWalletfindWallet");
    res
      .status(200)
      .json({ message: "wallet find success", data: data, status: true });
  } catch (error) {
    console.log(error, "errorrrrrrrrrr");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
