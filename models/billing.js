const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema ({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: "Products"
    }],

    date: {
        type: Date,
        required: true,
    },
});

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;