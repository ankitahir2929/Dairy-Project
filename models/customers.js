const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  num: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phNo: {
    type: Number,
  },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
