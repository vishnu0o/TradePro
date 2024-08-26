import asyncHandler from "express-async-handler";
import Products from "../database/Product.js";
import cartSchema from "../database/cart.js";

// @desc    Cart Create
// @route   post /api/cart/addToCart
// @access  user

export const addToCartController = asyncHandler(async (req, res) => {
  try {
    const { id, cartAmount, cartCount, Username } = req.body;
    const findProductDetails = await Products.findOne({ _id: id });
    const isCartItemExist = await cartSchema.findOne({ productId: id });
    if (!isCartItemExist) {
      const createCart = await cartSchema.create({
        productId: id,
        productName: findProductDetails?.name,
        price: findProductDetails?.price,
        subTotalPrice: cartAmount,
        cartCount: cartCount,
        orderedBy: Username,
        orderedDate: new Date(),
      });
      res.status(200).json({
        message: "cart Added successfully",
        status: true,
      });
    } else {
      res.status(401).json({
        message: "Item is already in the cart",
        status: false,
      });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", status: false });
  }
});

// @desc    Cart Update
// @route   post /api/cart/updateCart
// @access  user

export const updateCartController = asyncHandler(async (req, res) => {
  try {
    const { id, cartAmount, count } = req.body;
    const createCart = await cartSchema.updateOne(
      { _id: id },
      {
        $set: {
          subTotalPrice: cartAmount,
          cartCount: count,
        },
      }
    );
    res.status(200).json({
      message: "cart Added successfully",
      status: true,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", status: false });
  }
});

// @desc    Cart Find
// @route   post /api/cart/findCart
// @access  user

export const findCartController = asyncHandler(async (req, res) => {
  try {
    const findCart = await cartSchema.find({});
    res.status(200).json({
      message: "cart Find successfully",
      status: true,
      data: findCart,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", status: false });
  }
});
