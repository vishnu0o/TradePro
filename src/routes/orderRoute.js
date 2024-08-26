import express from "express";
import {
  orderCreateController,
  orderFindController,
} from "../controller/orderController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/orderCreate").post(auth, orderCreateController);
router.route("/findOrder").get(auth, orderFindController);

export default router;
