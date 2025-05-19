const express = require("express");
const Billing = require("../models/billing");

const billingController = require("../controllers/billing");

router.route("/").get(billingController.show);
