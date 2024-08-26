import express from "express";
import { registrationController } from "../controller/authController.js";

const router = express.Router();

router.route("/register").post(registrationController);

export default router;
