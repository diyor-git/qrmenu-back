require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const path = require("path");
const bodyParser = require("body-parser");

const AdminBro = require("admin-bro");
const AdminBroExpressjs = require("admin-bro-expressjs");
const adminBroMongoose = require("admin-bro-mongoose");
const router = require("./router");

const app = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(fileUpload({}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use("/api", router);

const start = async () => {
  try {
    const url = process.env.MONGOOSE;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(process.env.PORT || 5000, () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(e);
  }
};

start();
