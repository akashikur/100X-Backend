const express = require("express");
require("dotenv").config();
const app = express();
const db = require("./config/db");
const cors = require("cors");
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const userRouter = require("./routes/user");

const productRouter = require("./routes/product");

app.use("/user", userRouter);

app.use("/product", productRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is connected to :", PORT);
});
