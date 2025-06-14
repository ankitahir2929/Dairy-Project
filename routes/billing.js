const express = require("express");
const router = express.Router();

const billingController = require("../controllers/billing");

router
  .route("/")
  .get(billingController.show)
  .post(billingController.createNewBill);

router.route("/new").get(billingController.renderNewForm);

router.route("/:id").post(billingController.addNewBill);

router.route("/:id/new").get(billingController.renderAddNewBill);

router.route("/:id/bills").get(billingController.showBillDetails);

router
  .route("/:id/bills/:billId")
  .put(billingController.updateBillDetails)
  .delete(billingController.deleteBill);

router.route("/:id/bills/:billId/edit").get(billingController.renderEditForm);

module.exports = router;
