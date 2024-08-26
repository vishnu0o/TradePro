import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    require: true,
  },
  count: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: String,
    required: true,
  },
  orderData: {
    type: String,
    required: true,
  },
  orderedBy: {
    type: String,
    required: true,
  },
  status:{
    type:String,
  }
});

const orderSchema = mongoose.model("orders", Schema);

export default orderSchema;
