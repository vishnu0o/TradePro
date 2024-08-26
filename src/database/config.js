import mongoose from "mongoose";
import sanitizedConfig from "../config.js";

const connectDb = async () => {
  try {
    mongoose.connection
      .on("connecting", () => {
        console.log(" [ MongoDB ] connecting...");
      })
      .on("connected", () => {
        console.log(" [ MongoDB ] connected");
      })
      .on("disconnecting", () => {
        console.log(" [ MongoDB ] disconnecting...");
      })
      .on("disconnected", () => {
        console.log(" [ MongoDB ] disconnected");
      })
      .on("error", (err) => {
        console.log(" [ MongoDB ] error");
        console.error(err);
      });

    await mongoose.connect(sanitizedConfig.MONGO_URI);
    console.log(`🟢 Mongo db connected:`, mongoose.connection.host);
  } catch (error) {
    console.log("Mongo is error :", error);
  }
};
export default connectDb;
