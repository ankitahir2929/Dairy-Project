const express = require("express");
const router = express.Router();

const customersController = require("../controllers/customers");

router
  .route("/")
  .get(customersController.show)
  .post(customersController.createNewCustomer);

router.get("/new", customersController.renderNewForm);

router.route("/:id").delete(customersController.deleteCustomer);

module.exports = router;
