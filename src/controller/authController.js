import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { sendOTP } from "../utils/TwilioConfig.js";
import registratedUser from "../database/registratedUser.js";
import generateToken from "../utils/generateToken.js";
import OtpStore from "../database/otpStore.js";
import referralWallet from "../database/referralWallet.js";

let sendOtp = [];

// Function for creation Random code :::::::::::::::::::

function generateRandomCode() {
  const digits = "0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let result = "";

  // Add two random digits
  for (let i = 0; i < 2; i++) {
    const randomDigitIndex = Math.floor(Math.random() * digits.length);
    result += digits[randomDigitIndex];
  }

  // Add four random letters
  for (let i = 0; i < 4; i++) {
    const randomLetterIndex = Math.floor(Math.random() * letters.length);
    result += letters[randomLetterIndex];
  }

  return result;
}

// @desc    register
// @route   post /api/auth/register
// @access  user

export const registrationController = asyncHandler(async (req, res) => {
  try {
    let { email, phoneNumber } = req.body;

    const isUserExist = await registratedUser.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }]
    });
    if (isUserExist == null) {
      sendOTP(phoneNumber)
        .then(async (success) => {
          await OtpStore.deleteMany({});
          const createOtp = await OtpStore.create({
            phoneNumber: phoneNumber,
            otp: success.otp
          });
          sendOtp.push(success.otp);
          res
            .status(200)
            .json({ message: "otp send successfully", status: true });
        })
        .catch((error) => {
          console.log("Failed to send OTP:", error);
          res.status(500).json({
            message: "Faild to send otp",
            status: false,
            data: error
          });
        });
    } else {
      res
        .status(400)
        .json({ message: "Email or Phone already exist", status: false });
    }
  } catch (error) {
    console.log(error, "errorrrrrrrrrr");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    register
// @route   post /api/auth/verifyOtp
// @access  user

export const verifyOtpController = asyncHandler(async (req, res) => {
  try {
    let { name, email, phoneNumber, countryCode, password, otp, referralCode } =
      req.body;

    // Formdatted current date

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    let randomCouponCode = generateRandomCode();

    const findStoredOtp = await OtpStore.findOne({ phoneNumber });

    let findUserWithReferralCode;
    let nextLevel;

    if (referralCode) {
      findUserWithReferralCode = await registratedUser.findOne({
        referralCode: referralCode
      });
      // // Get the current levels array
      // const levels = findUserWithReferralCode.levels;

      // // Check the last level in the levels array
      // const lastLevel =
      //   levels.length > 0 ? levels[levels.length - 1].levelName : null;

      // if (lastLevel) {
      //   // Extract the number from the last level name (e.g., "Level 1" -> 1)
      //   const lastLevelNumber = parseInt(lastLevel.split(" ")[1], 10);
      //   // Increment the level number for the next level
      //   nextLevel = `Level ${lastLevelNumber + 1}`;
      // } else {
      //   // If no levels exist, start from Level 1
      //   nextLevel = "Level 1";
      // }
    }

    if (otp == findStoredOtp?.otp) {
      password = await bcrypt.hash(password, 10);
      const createUser = await registratedUser.create({
        name: name,
        email: email,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        password: password,
        isNotification: false,
        profileImage: "",
        status: "Active",
        referralCode: randomCouponCode,
        referredBy: findUserWithReferralCode
          ? findUserWithReferralCode?._id
          : "",
        isPurchased: false,
        referralDate: referralCode ? formattedDate : "",
        referralBonusReceivedDate: ""
      });
      if (referralCode) {
        await registratedUser.findByIdAndUpdate(
          findUserWithReferralCode._id,
          {
            $push: { levels: { levelName: "Level 1", userId: createUser._id } }
          }, // Push the new level
          { new: true, useFindAndModify: false } // Return the updated document
        );

        const updateWallet = await referralWallet.updateOne(
          { userId: findUserWithReferralCode?._id }, // Find the user's wallet
          {
            $push: {
              totalTeamMembers: createUser._id, // Update total team members
              inActiveUsers: createUser._id, // Update inactive users
              "levels.$[level].totalReferrals": createUser._id, // Update total referrals in the specified level
              "levels.$[level].inActiveUsers": createUser._id // Update inactive users in the specified level
            }
          },
          {
            arrayFilters: [{ "level.levelName": "Level 1" }] // Filter to update the correct level by levelName
          }
        );
      }
      if (findUserWithReferralCode?.referredBy) {
        const updateWallet = await referralWallet.updateOne(
          { userId: findUserWithReferralCode?.referredBy }, // Find the user's wallet
          {
            $push: {
              totalTeamMembers: createUser._id, // Update total team members
              inActiveUsers: createUser._id, // Update inactive users
              "levels.$[level].totalReferrals": createUser._id, // Update total referrals in the specified level
              "levels.$[level].inActiveUsers": createUser._id // Update inactive users in the specified level
            }
          },
          {
            arrayFilters: [{ "level.levelName": "Level 2" }] // Filter to update the correct level by levelName
          }
        );
      }

      const findWallet = await referralWallet.findOne({
        userId: createUser._id
      });

      if (!findWallet) {
        const createWallet = await referralWallet.create({
          userId: createUser._id,
          totalIncome: 0,
          isPurchased: false,
          levels: [
            {
              levelName: "Level 1",
              visibility: true,
              levelIncome: 0,
              totalReferrals: [],
              activeUsers: [],
              inActiveUsers: []
            },
            {
              levelName: "Level 2",
              visibility: false,
              levelIncome: 0,
              totalReferrals: [],
              activeUsers: [],
              inActiveUsers: []
            }
          ]
        });
      }

      let token = generateToken(createUser._id);
      res.status(200).json({
        message: "otp verified successfully",
        jwtToken: token,
        name: createUser?.name,
        id: createUser?._id
      });
    } else {
      res.status(500).json({ message: "otp not matching" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    Login
// @route   post /api/auth/login
// @access  user

export const loginController = asyncHandler(async (req, res) => {
  try {
    let { email, password } = req.body;

    const isUserexist = await registratedUser.findOne({
      email: email
    });

    if (isUserexist) {
      bcrypt
        .compare(password, isUserexist.password)
        .then((isMatch) => {
          if (isMatch) {
            let token = generateToken(isUserexist._id);
            res.status(201).send({
              message: "Login successfully",
              jwtToken: token,
              name: isUserexist?.name,
              id: isUserexist?._id
            });
          } else {
            res
              .status(400)
              .json({ message: "Password is incorrect", status: false });
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
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    Forgot password
// @route   post /api/auth/forgotPassword
// @access  user

export const forgotPasswordController = asyncHandler(async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const findUser = await registratedUser.findOne({
      phoneNumber: phoneNumber
    });
    if (findUser) {
      sendOTP(phoneNumber)
        .then(async (success) => {
          sendOtp = success.otp;
          res
            .status(200)
            .json({ message: "otp send successfully", status: true });
        })
        .catch((error) => {
          console.log("Failed to send OTP:", error);
          res.status(500).json({
            message: "Faild to send otp",
            status: false,
            data: error
          });
        });
    } else {
      res.status(400).json({ message: "PhoneNumber not exist", status: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    Verify otp
// @route   post /api/auth/verifyOtp
// @access  user

export const forgotPasswordVerifyOtpController = asyncHandler(
  async (req, res) => {
    try {
      const { otp } = req.body;

      if (otp == sendOtp) {
        res
          .status(200)
          .json({ message: "Verified successfully", status: true });
      } else {
        res.status(400).json({ message: "Incorrect otp", status: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", data: error });
    }
  }
);

// @desc    Change password
// @route   post /api/auth/changePassword
// @access  user

export const changePasswordController = asyncHandler(async (req, res) => {
  try {
    let { password, phoneNumber } = req.body;

    const findUser = await registratedUser.findOne({
      phoneNumber: phoneNumber
    });

    if (findUser) {
      password = await bcrypt.hash(password, 10);
      const updatePassword = await registratedUser.updateOne(
        { phoneNumber: phoneNumber },
        { $set: { password: password } }
      );
      res
        .status(200)
        .json({ message: "Password updated successfully", status: true });
    } else {
      res.status(400).json({ message: "User not exist", status: false });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
