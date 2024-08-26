import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  descriptioin: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Products = mongoose.model("Products", Schema);

export default Products;
