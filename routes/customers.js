const express = require("express");
const router = express.Router();

const customersController = require("../controllers/customers");

router
  .route("/")
  .get(customersController.index)
  .post(customersController.createNewCustomer);

router
  .route("/:id")
  .put(customersController.updateCustomer)
  .delete(customersController.deleteCustomer);

router.get("/new", customersController.renderNewForm);

router.get("/:id/edit", customersController.renderEditForm);

module.exports = router;
