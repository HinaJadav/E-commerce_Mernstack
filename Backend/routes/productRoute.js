const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct} = require("../controllers/productController");

const router = express.Router();

// Create product
router.route("/product/new").post(createProduct); // import product APTS

// Read/Get product
router.route("/products").get(getAllProducts);

// Update product
router.route("/product/:id").put(updateProduct); // this function we bring from "productController.js"

// Delete product
router.route("/product/:id").delete(deleteProduct); // this function we bring from

module.exports = router;