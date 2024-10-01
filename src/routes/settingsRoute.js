import express from "express";
import auth from "../middleware/auth.js";
import { profileFindController, profileUpdateController } from "../controller/settingsController.js";
import upload from "../utils/multer.js";
const router = express.Router();
router.route("/findProfile").get(auth, profileFindController);
router.route("/updateProfile").post(upload.single("image"),auth, profileUpdateController);


export default router;
