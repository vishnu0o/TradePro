import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  transactionID: {
    type: String
  },
  transactionDate: {
    type: String
  },
  Type: {
    type: String
  },
  Amount: {
    type: String
  },
  Status: {
    type: String
  },
  comment: {
    type: String
  }
});

const transactionHistory = mongoose.model("transactionHistory", Schema);

export default transactionHistory;
