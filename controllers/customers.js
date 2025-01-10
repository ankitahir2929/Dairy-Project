const Customer = require("../models/customers");

module.exports.show = async (req, res) => {
  const customers = await Customer.find({});
  res.render("customers/show.ejs", { customers });
};

module.exports.createNewCustomer = async (req, res) => {
  const newCustomer = new Customer(req.body.customer);
  await newCustomer.save();
  res.redirect("customers");
};

module.exports.renderNewForm = (req, res) => {
  res.render("customers/new");
};

module.exports.deleteCustomer = async (req, res) => {
  let { id } = req.params;
  await Customer.findByIdAndDelete(id);
  res.redirect("../customers");
};
