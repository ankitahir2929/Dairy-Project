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
  address: {
    type: String,
  },
  milkType: {
    type: String,
  },
  joinDate: {
    type: Date,
    required: true,
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
