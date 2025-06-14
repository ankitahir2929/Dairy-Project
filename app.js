const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Product = require("./models/product.js");
const Customer = require("./models/customers.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Admin = require("./models/admin.js");

const productsRoute = require("./routes/products.js");
const customersRoute = require("./routes/customers.js");
const billingRoute = require("./routes/billing.js");

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

let date = new Date(Date.now());
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/products", productsRoute);
app.use("/customers", customersRoute);
app.use("/billing", billingRoute);

app.get("/", (req, res) => {
  res.send("Hello");
});

// app.get("/home", (req, res) => {
//   res.render("products/index.ejs");
// });

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new Admin({
//     email: "admin@gmail.com",
//     username: "admin",
//   });

//   const newUser = await Admin.register(fakeUser, "password");
//   res.send(newUser);
// });

app.get("/signup", async (req, res) => {
  res.render("admin/signup");
});

app.post("/signup", async (req, res) => {
  try {
    const { email, pass } = req.body.admin;
    const admin = new Admin({
      email: email,
      username: email,
    });
    const newAdmin = await Admin.register(admin, pass);
    res.send(newAdmin);
  } catch (error) {
    req.flash("error", error.message);
  }
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

app.listen(2929, () => {
  console.log("app is listening to port 2929");
});
