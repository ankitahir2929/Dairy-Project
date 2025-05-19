const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  // _id: {
  //   type: String,
  //   required: true,
  // },
  num: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  supName: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products;
