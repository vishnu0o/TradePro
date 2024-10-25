import express from "express";
import auth from "../middleware/auth.js";
import {
  changePasswordController,
  createWishlistController,
  findReferralController,
  findWalletController,
  findWishlistcontroller,
  profileFindController,
  profileUpdateController,
  removeWishlistcontroller,
  transactionHistoryController,
  withDrawalController
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
router.route("/changePassword").put(auth, changePasswordController);
router.route("/findWallet").get(auth, findWalletController);
router.route("/withdraw").post(auth, withDrawalController);
router.route("/transactionHistory").get(auth, transactionHistoryController);







export default router;
