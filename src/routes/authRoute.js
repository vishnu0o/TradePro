import express from "express";
import { registrationController, verifyOtpController } from "../controller/authController.js";

const router = express.Router();

router.route("/register").post(registrationController);
router.route("/verifyOtp").post(verifyOtpController);


export default router;
