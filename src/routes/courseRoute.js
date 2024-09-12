import express from "express";
import { courseFindController, courseFindOneController } from "../controller/courseController.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.route("/findCourse").get(auth,courseFindController);
router.route("/findOneCourse").get(auth,courseFindOneController);


export default router;
