const Product = require("../models/product");

let date = new Date().toISOString().slice(0, 10);

module.exports.show = async (req, res) => {
  const products = await Product.find({});
  res.render("products/show", { products });
};

module.exports.renderNewForm = async (req, res) => {
  let id = (await Product.countDocuments()) + 1;
  res.render("products/new", { date, id });
};

module.exports.createNewProduct = async (req, res) => {
  const newProduct = new Product(req.body.products);
  await newProduct.save();
  res.redirect("products");
};

module.exports.updateProduct = async (req, res) => {
  let { id } = req.params;
  await Product.findByIdAndUpdate(id, { ...req.body.product });
  res.redirect("products");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product });
};

module.exports.deleteProduct = async (req, res) => {
  let { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("../products");
};
