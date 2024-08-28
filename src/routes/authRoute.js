import express from "express";
import {
  forgotPasswordController,
  forgotPasswordVerifyOtpController,
  loginController,
  registrationController,
  verifyOtpController
} from "../controller/authController.js";

const router = express.Router();

router.route("/register").post(registrationController);
router.route("/verifyOtp").post(verifyOtpController);
router.route("/login").post(loginController);
router.route("/forgotPassword").post(forgotPasswordController);
router.route("/forgotVerifyOtp").post(forgotPasswordVerifyOtpController);


export default router;
