import cartSchema from "../database/cart.js";
import orderSchema from "../database/orderSchema.js";
import asyncHandler from "express-async-handler";

// @desc    product find
// @route   post /api/order/orderCreate
// @access  user

export const orderCreateController = asyncHandler(async (req, res) => {
  try {
    const { cartData, name } = req.body;
    const code = Math.floor(100 + Math.random() * 900);
    cartData?.map(async (value) => {
      const createOrder = await orderSchema.create({
        orderId: `OrderID:${code}`,
        productId: value?.productId,
        ProductName: value?.productName,
        totalPrice: value?.subTotalPrice,
        price: value?.price,
        count: value?.cartCount,
        orderData: new Date(),
        orderedBy: name,
        status: "Accepted",
      });
    });

    cartData?.map(async (item) => {
      const clearCart = await cartSchema.deleteMany({
        productId: item?.productId,
      });
    });
    res.status(200).json({
      message: "Order create successfully",
      status: true,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", status: false });
  }
});

// @desc    orderFind
// @route   post /api/order/findOrder
// @access  user

export const orderFindController = asyncHandler(async (req, res) => {
  try {
    const findOrders = await orderSchema.find({});

    res.status(200).json({
      message: "orders find successfully",
      status: true,
      data: findOrders,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ message: "Something went wrong", status: false });
  }
});
