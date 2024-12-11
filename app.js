const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Product = require("./models/product.js");
const Customer = require("./models/customers.js");

let date = new Date().toISOString().slice(0, 10);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/dairy";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/home", (req, res) => {
  res.render("products/index.ejs");
});

app.get("/show", async (req, res) => {
  const products = await Product.find({});
  res.render("products/show.ejs", { products });
});

//Create Route
app.get("/products/new", async (req, res) => {
  let id = (await Product.countDocuments()) + 1;
  res.render("products/new.ejs", { date, id });
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body.products);
  await newProduct.save();
  res.redirect("/show");
});

//Edit Route
app.get("/products/:id/edit", async (req, res) => {
  let { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit.ejs", { product });
});

app.put("/products/:id", async (req, res) => {
  let { id } = req.params;
  await Product.findByIdAndUpdate(id, { ...req.body.product });
  res.redirect("products/show.ejs");
});

//Delete Route
app.delete("/products/:id", async (req, res) => {
  let { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("products/show");
});

app.get("/products/show", (req, res) => {
  res.render("products/show.ejs");
});

app.get("/customers", (req, res) => {
  res.send("developement in progress");
});

app.listen(2929, () => {
  console.log("app is listenint to port 2929");
});
