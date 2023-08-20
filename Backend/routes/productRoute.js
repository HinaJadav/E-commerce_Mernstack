const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, gerProductDetails} = require("../controllers/productController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

// Create product
router.route("/product/new").post(createProduct); // import product APTS

// Read/Get product
router.route("/products").get(isAuthenticatedUser, getAllProducts);

// Update product
router.route("/product/:id").put(updateProduct); // this function we bring from "productController.js"

// Delete product
router.route("/product/:id").delete(deleteProduct); // this function we bring from "productController.js"

// Get product details
router.route("/product/:id").get(gerProductDetails); // this function we bring from "productController.js"
 

module.exports = router;