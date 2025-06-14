const Product = require("../models/product");

let date = new Date(Date.now());
module.exports.show = async (req, res) => {
  const products = await Product.find({});
  res.render("products/show", { products });
};

module.exports.renderNewForm = async (req, res) => {
  let id = (await Product.countDocuments()) + 1;
  res.render("products/new", { date, id });
};

module.exports.createNewProduct = async (req, res) => {
  let newProduct = new Product(req.body.products);
  newProduct.updatedAt = newProduct.dateAdded;
  newProduct.stock = newProduct.qty;
  await newProduct.save();
  res.redirect("products");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit.ejs", { product });
};

module.exports.updateProduct = async (req, res) => {
  let { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, { ...req.body.products });
  product.updatedAt = date;
  await product.save();
  res.redirect("/products");
};

module.exports.deleteProduct = async (req, res) => {
  let { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/products");
};
