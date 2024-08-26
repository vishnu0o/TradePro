import bodyParser from "body-parser";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sanitizedConfig from "./src/config.js";
import authRoute from "./src/routes/authRoute.js";
import productRoute from "./src/routes/productRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import cartRoute from "./src/routes/cartRoute.js";

import connectDb from "./src/database/config.js";

// dotenv Configration
dotenv.config();

// db Connectig
connectDb();

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));

app.use(cors());

// redirect api to router

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);



const PORT = sanitizedConfig.PORT || 9000;
server.listen(PORT, () =>
  console.log(
    `🟢 Server running in ${sanitizedConfig.NODE_ENV} mode on port ${PORT}`
  )
);
