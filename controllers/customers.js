const Customer = require("../models/customers");

module.exports.index = async (req, res) => {
  const customers = await Customer.find({}).sort({ num: 1 });
  res.render("customers/index.ejs", { customers });
};

module.exports.createNewCustomer = async (req, res) => {
  const newCustomer = new Customer(req.body.customer);
  await newCustomer.save();
  res.redirect("customers");
};

module.exports.renderNewForm = (req, res) => {
  res.render("customers/new");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const customer = await Customer.findById(id);
  res.render("customers/edit.ejs", { customer });
};

module.exports.updateCustomer = async (req, res) => {
  let { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(id, {
    ...req.body.customer,
  });
  await customer.save();
  res.redirect("/customers");
};

module.exports.deleteCustomer = async (req, res) => {
  let { id } = req.params;
  await Customer.findByIdAndDelete(id);
  res.redirect("../customers");
};
