import express from "express";
import {
  addToCartController,
  findCartController,
  updateCartController,
} from "../controller/cartController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.route("/addToCart").post(auth,addToCartController);
router.route("/findCart").get(auth,findCartController);
router.route("/updateCart").put(auth,updateCartController);


export default router;
