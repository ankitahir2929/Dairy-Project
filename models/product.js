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
  stock: {
    type: Number,
    required: true,
  },
  supName: {
    type: String,
  },
  supCode: {
    type: String,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
  dateExpiry: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  description: {
    type: String,
  },
  costPrice: {
    type: Number,
  },
  minStock: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  barcode: {
    type: String,
  },
  condition: {
    type: String,
  },
  location: {
    type: String,
  },
  tags: {
    type: String,
  },
  notes: {
    type: String,
  },
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products;
