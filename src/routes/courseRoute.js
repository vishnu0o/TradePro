import express from "express";
import {
  chapterIsPlayedController,
  checkOutController,
  courseFindController,
  courseFindOneController
} from "../controller/courseController.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.route("/findCourse").get(auth,courseFindController);
router.route("/findOneCourse").get(auth,courseFindOneController);
router.route("/checkout").post(auth,checkOutController);
router.route("/chapterIsPlayed").post(auth,chapterIsPlayedController);

export default router;
