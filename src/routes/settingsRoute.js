import express from "express";
import auth from "../middleware/auth.js";
import {
  createWishlistController,
  findReferralController,
  findWishlistcontroller,
  profileFindController,
  profileUpdateController,
  removeWishlistcontroller
} from "../controller/settingsController.js";
import upload from "../utils/multer.js";
const router = express.Router();
router.route("/findProfile").get(auth, profileFindController);
router
  .route("/updateProfile")
  .post(upload.single("image"), auth, profileUpdateController);
router.route("/findWishlist").get(auth, findWishlistcontroller);
router.route("/createWishlist").post(auth, createWishlistController);
router.route("/removeWishlist").delete(auth, removeWishlistcontroller);
router.route("/findReferralCode").get(auth, findReferralController);



export default router;
