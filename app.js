const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Product = require("./models/product.js");
const Customer = require("./models/customers.js");

const productsRouter = require("./routes/products.js");
const customersRouter = require("./routes/customers.js");

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

app.use("/products", productsRouter);
app.use("/customers", customersRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/home", (req, res) => {
  res.render("products/index.ejs");
});

// app.get("/products/show");

// //Create Route
// app.get("/products/new");

// app.post("/products");

// //Edit Route
// app.get("/products/:id/edit");

// app.put("/products/:id");

// //Delete Route
// app.delete("/products/:id");

app.listen(2929, () => {
  console.log("app is listenint to port 2929");
});
