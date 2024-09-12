import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { sendOTP } from "../utils/TwilioConfig.js";
import registratedUser from "../database/registratedUser.js";
import generateToken from "../utils/generateToken.js";

let sendOtp = [];

// @desc    register
// @route   post /api/auth/register
// @access  user

export const registrationController = asyncHandler(async (req, res) => {
  try {
    let { email, phoneNumber } = req.body;

    console.log(req.body, "reqqqqqqqqqqqqqqqqqq");

    const isUserExist = await registratedUser.findOne({ email: email });

    console.log(isUserExist, "isUserExistisUserExist");

    if (isUserExist == null) {
      sendOTP(phoneNumber)
        .then(async (success) => {
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
      res.status(400).json({ message: "Email already exist", status: false });
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
    let { name, email, phoneNumber, countryCode, password, otp } = req.body;

    console.log(sendOtp, "sendOtpsendOtpsendOtp");
    console.log(req.body, "reqqqqqqqqqqqqqqq");

    if (otp == sendOtp) {
      password = await bcrypt.hash(password, 10);
      const createUser = await registratedUser.create({
        name: name,
        email: email,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        password: password,
        status: "Active"
      });
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
