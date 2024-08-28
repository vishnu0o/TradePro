import express from "express";
import { loginController, registrationController, verifyOtpController } from "../controller/authController.js";

const router = express.Router();

router.route("/register").post(registrationController);
router.route("/verifyOtp").post(verifyOtpController);
router.route("/login").post(loginController);



export default router;
