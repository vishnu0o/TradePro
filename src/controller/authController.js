import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { sendOTP, verifyOTP } from "../utils/TwilioConfig.js";
import registratedUser from "../database/registratedUser.js";
import generateToken from "../utils/generateToken.js";

let sendOtp;

// @desc    register
// @route   post /api/auth/register
// @access  user

export const registrationController = asyncHandler(async (req, res) => {
  try {
    let { email, phoneNumber } = req.body;

    const isUserExist = await registratedUser.findOne({ email: email });

    if (!isUserExist) {
      sendOTP(phoneNumber)
        .then(async (success) => {
          sendOtp = success.otp;
          res
            .status(200)
            .json({ message: "otp send successfully", status: true });
        })
        .catch((error) => {
          console.log("Failed to send OTP:", error);
          res
            .status(500)
            .json({ message: "Faild to send otp", status: false, data: error });
        });
    } else {
      res.status(400).json({ message: "Email already exist", status: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});

// @desc    register
// @route   post /api/auth/verifyOtp
// @access  user

export const verifyOtpController = asyncHandler(async (req, res) => {
  try {
    let { name, email, phoneNumber, countryCode, password, otp } = req.body;

    if (otp == sendOtp) {
      password = await bcrypt.hash(password, 10);
      const createUser = await registratedUser.create({
        name: name,
        email: email,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        password: password
      });
      let token = generateToken(createUser._id);
      res
        .status(200)
        .json({
          message: "otp verified successfully",
          jwtToken: token,
          name: createUser?.name,
          id: createUser?._id
        });
    } else {
      res.status(500).json({ message: "otp not matching" });
    }
  } catch (error) {
    console.log(error, "errorrrrrrrrrrrrrrrr");
    res.status(500).json({ message: "Something went wrong", data: error });
  }
});
