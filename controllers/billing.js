const Billing = require("../models/billing");
const Customer = require("../models/customers");
const Product = require("../models/product");

let date = new Date(Date.now());

module.exports.show = async (req, res) => {
  let { startDate, endDate } = req.query;
  const customers = await Customer.find({})
    .sort({ num: 1 })
    .populate({
      path: "billing",
      match: { date: { $gte: startDate, $lte: endDate } },
      options: { sort: { date: 1 } },
    });
  res.render("billing/show", { customers });
};

module.exports.createNewBill = async (req, res) => {
  let customer = await Customer.findById(req.params);
  let newBill = new Billing(req.body.billing);
  customer.billing.push(newBill);
  await newBill.save();
  await customer.save();
  req.flash(
    "success",
    `${newBill.proName} added to ${customer.num}: ${customer.name}`
  );
  res.redirect("/billing");
};

module.exports.addNewBill = async (req, res) => {
  let { id } = req.params;
  let customer = await Customer.findById(id);
  let newBill = new Billing(req.body.billing);
  customer.billing.push(newBill);
  await newBill.save();
  await customer.save();
  req.flash(
    "success",
    `${newBill.proName} added to ${customer.num}: ${customer.name}`
  );
  res.redirect("/billing");
};

module.exports.renderAddNewBill = async (req, res) => {
  let { id } = req.params;
  let customer = await Customer.findById(id);
  const products = await Product.find({});
  res.render("billing/addnewbill", { customer, products, date });
};

module.exports.renderNewForm = async (req, res) => {
  const customers = await Customer.find({});
  const products = await Product.find({});
  res.render("billing/new", { customers, products, date });
};

module.exports.renderEditForm = async (req, res) => {
  let { id, billId } = req.params;
  const customer = await Customer.findById(id);
  const billing = await Billing.findById(billId);
  res.render("billing/edit", { customer, billing });
};

module.exports.showBillDetails = async (req, res) => {
  let { id } = req.params;
  const customer = await Customer.findById(id).populate({
    path: "billing",
    options: { sort: { date: 1 } },
  });
  res.render("billing/bills", { customer });
};

module.exports.updateBillDetails = async (req, res) => {
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
};

module.exports.deleteBill = async (req, res) => {
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
};
