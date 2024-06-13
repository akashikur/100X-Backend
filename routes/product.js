const express = require("express");
const { isAuth } = require("../middleweare/AuthMiddleware");
const {
  createProduct,
  getUserProduct,
  deleteProduct,
  editProduct,
  customerProduct,
  adminFilter,
} = require("../controllers/product.controller");

const app = express();

app.post("/createProduct", isAuth, createProduct);

app.get("/getUserProduct", isAuth, getUserProduct);

app.delete("/deleteProduct/:productId", isAuth, deleteProduct);

app.put("/updateProduct", isAuth, editProduct);

app.get("/customerProduct", isAuth, customerProduct);

app.get("/adminFilter/:createdBy", isAuth, adminFilter);

module.exports = app;
