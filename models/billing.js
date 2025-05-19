const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  // product: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Product",
  //   },
  // ],

  proNo: {
    type: Number,
    required: true,
  },

  proPrice: {
    type: Number,
    required: true,
  },

  proName: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
});

const Billing = mongoose.model("Billings", billingSchema);
module.exports = Billing;
