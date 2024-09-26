import express from "express";
import { checkOutController, courseFindController, courseFindOneController } from "../controller/courseController.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.route("/findCourse").get(courseFindController);
router.route("/findOneCourse").get(courseFindOneController);
router.route("/checkout").post(checkOutController);


export default router;
