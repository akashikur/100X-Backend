const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productname: {
    type: String,
    required: true,
  },
  productDetails: {
    type: String,
    required: true,
  },
  creationTime: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("product", ProductSchema);
