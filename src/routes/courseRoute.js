import express from "express";
import { courseFindController } from "../controller/courseController.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.route("/findCourse").get(courseFindController);

export default router;
