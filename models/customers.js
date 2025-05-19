const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Billing = require("./billing");

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
  billing: [
    {
      type: Schema.Types.ObjectId,
      ref: "Billings",
    },
  ],
});

const Customer = mongoose.model("Customers", customerSchema);
module.exports = Customer;
