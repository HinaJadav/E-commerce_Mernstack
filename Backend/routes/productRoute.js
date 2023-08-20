const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Create product
router
.route("/admin/product/new")
.post(isAuthenticatedUser,authorizeRoles("admin"),  createProduct); // import product APTS

// Read/Get product
router
.route("/products")
.get(getAllProducts);

// Update product
router
.route("/admin/product/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),  updateProduct); // this function we bring from "productController.js"

// Delete product
router
.route("/admin/product/:id")
.delete(isAuthenticatedUser,authorizeRoles("admin"),  deleteProduct); // this function we bring from "productController.js"

// Get product details
router
.route("/product/:id")
.get(getProductDetails); // this function we bring from "productController.js"
 
router
.route("/review")
.put(isAuthenticatedUser, createProductReview);

router
.route("/reviews")
.get(getProductReviews)
.delete(isAuthenticatedUser, deleteReview); // why use "isAuthenticatedUser" :  bcz for delete review user must logged in


module.exports = router;