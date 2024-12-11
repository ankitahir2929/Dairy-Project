const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema ({
    _id: {
        type: String, 
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    supName: {
        type: String,
    },
    date: {
        type: String,
        default: Date.now
    },
});

const Products = mongoose.model("Products", productSchema);
module.exports = Products;