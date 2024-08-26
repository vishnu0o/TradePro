import express from "express";
import {
  productFindController,
  productFindOneController,
} from "../controller/productController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/findProduct").get(auth, productFindController);
router.route("/findOneProduct").get(auth, productFindOneController);

export default router;
