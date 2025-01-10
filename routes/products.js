const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

router
  .route("/")
  .get(productsController.show)
  .post(productsController.createNewProduct);

router
  .route("/:id")
  .put(productsController.updateProduct)
  .delete(productsController.deleteProduct);

router.route("/new").get(productsController.renderNewForm);

router.route("/:id/edit").get(productsController.renderEditForm);

module.exports = router;
