import Products from "../database/Product.js";
import asyncHandler from "express-async-handler";

// @desc    product find
// @route   post /api/product/findProduct
// @access  user

export const productFindController = asyncHandler(async (req, res) => {
  try {
    const findProduct = await Products.find({});
    res.status(200).json({
      message: "Product find successfully",
      status: true,
      data: findProduct,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", status: false });
  }
});

// @desc    product findone
// @route   get /api/product/findOneProduct
// @access  user

export const productFindOneController = asyncHandler(async (req, res) => {
  try {
    const { id } = req.query;
    const findProduct = await Products.findOne({ _id: id });
    res.status(200).json({
      message: "Product find successfully",
      status: true,
      data: findProduct,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", status: false });
  }
});
