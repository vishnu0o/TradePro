import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  subTotalPrice: {
    type: String,
    require: true,
  },
  cartCount: {
    type: String,
    required: true,
  },
  orderedBy: {
    type: String,
    required: true,
  },
  orderedDate:{
    type:String,
    require:true
  }
});

const cartSchema = mongoose.model("cart", Schema);

export default cartSchema;
