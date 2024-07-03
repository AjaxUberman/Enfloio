const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const router = express.Router();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://jade-hummingbird-882ad1.netlify.app",
      "http://jade-hummingbird-882ad1.netlify.app",
      "https://enfloio.com.tr",
      "http://enfloio.com.tr",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);
mongoose.connect(process.env.MONGO_URL);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/test", (req, res) => {
  res.json("Server Working.");
});

const accountRoutes = require("./routes/accountRoutes");
app.use("/account", accountRoutes);

const investRoutes = require("./routes/investRoutes");
app.use("/investments", investRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server working at : ${PORT}`);
});
