const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Product = require("./models/product.js");
const Customer = require("./models/customers.js");
const Billing = require("./models/billing.js");
const session = require("express-session");
const flash = require("connect-flash");
const Passport = require("passport");
const localStrategy = require("passport-local");
const Admin = require("./models/admin.js");

const productsRouter = require("./routes/products.js");
const customersRouter = require("./routes/customers.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/dairy";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 17 * 24 * 60 * 60 * 1000,
    maxAge: 17 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

let date = new Date(Date.now());
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.delete = req.flash("delete");
  res.locals.error = req.flash("error");
  next();
});

app.use("/products", productsRouter);
app.use("/customers", customersRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

// app.get("/home", (req, res) => {
//   res.render("products/index.ejs");
// });

app.get("/billing", async (req, res) => {
  let { startDate, endDate } = req.query;
  const customers = await Customer.find({})
    .sort({ num: 1 })
    .populate({
      path: "billing",
      match: { date: { $gte: startDate, $lte: endDate } },
      options: { sort: { date: 1 } },
    });
  res.render("billing/show", { customers });
});

app.get("/billing/new", async (req, res) => {
  const customers = await Customer.find({});
  const products = await Product.find({});
  res.render("billing/new", { customers, products, date });
});

app.get("/billing/:id/bills", async (req, res) => {
  let { id } = req.params;
  const customer = await Customer.findById(id).populate({
    path: "billing",
    options: { sort: { date: 1 } },
  });
  res.render("billing/bills", { customer });
});

app.get("/billing/:id/bills/:billId/edit", async (req, res) => {
  let { id, billId } = req.params;
  const customer = await Customer.findById(id);
  const billing = await Billing.findById(billId);
  res.render("billing/edit", { customer, billing });
});

app.put("/billing/:id/bills/:billId", async (req, res) => {
  let { id, billId } = req.params;
  const bill = await Billing.findByIdAndUpdate(billId, req.body.billing, {
    new: true,
  });
  await bill.save();
  const customer = await Customer.findByIdAndUpdate(id, {
    $pull: { billing: billId },
  });
  await Customer.findByIdAndUpdate(id, { $push: { billing: bill._id } });
  res.redirect(`/billing/${id}/bills`);
});

app.get("/get-customer/:custNo", async (req, res) => {
  const custNo = parseInt(req.params.custNo); // Convert to number

  try {
    const customer = await Customer.findOne({ num: custNo });

    if (customer) {
      res.json({ customerName: customer.name });
    } else {
      res.json({ customerName: null });
    }
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-product/:proNo", async (req, res) => {
  const proNo = parseInt(req.params.proNo); // Convert to number
  const proPrice = parseInt(req.params.proPrice);
  try {
    const product = await Product.findOne({ num: proNo });

    if (product) {
      res.json({ productName: product.name, productPrice: product.price });
    } else {
      res.json({ productName: null });
      res.json({ productPrice: null });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/billing", async (req, res) => {
  let customer = await Customer.findOne({ num: req.body.custNo });
  let newBill = new Billing(req.body.billing);
  customer.billing.push(newBill);
  await newBill.save();
  await customer.save();
  req.flash(
    "success",
    `${newBill.proName} added to ${customer.num}: ${customer.name}`
  );
  res.redirect("/billing");
});

app.delete("/billing/:id/bills/:billId", async (req, res) => {
  try {
    const { id, billId } = req.params;

    // Find the bill first to get its details for the message
    const bill = await Billing.findById(billId);
    const customer = await Customer.findById(id);

    await Customer.findByIdAndUpdate(id, {
      $pull: { billing: billId },
    });

    await Billing.findByIdAndDelete(billId);

    req.flash(
      "success",
      `Bill ${bill.proNo}: ${bill.proName} from ${customer.name} has been deleted`
    );
    res.redirect(`/billing/${id}/bills`);
  } catch (err) {
    req.flash("error", "Failed to delete bill: " + err.message);
    res.redirect(`/billing/${req.params.id}/bills`);
  }
});

app.listen(2929, () => {
  console.log("app is listening to port 2929");
});
