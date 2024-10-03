import asyncHandler from "express-async-handler";
import registratedUser from "../database/registratedUser.js";
import { uploadFileToS3 } from "../utils/S3Upload.js";
import fs from "fs";
import wishlist from "../database/wishlist.js";

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

    const createWishlist = await wishlist.create({
      courseId: courseId,
      language: language,
      userId: userId
    });
    res.status(200).json({ message: "Added to wishlist successfully" });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    wishlist create
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
    const { id } = req.query;
    const removeWishlist = await wishlist.deleteOne({ _id: id });
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

    res.status(200).json({message:"ReferralCode find successfully",data:findReferralCode?.referralCode})
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
