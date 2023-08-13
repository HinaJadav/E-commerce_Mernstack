const express = require("express");
const { getAllProducts, createProduct, updateProduct} = require("../controllers/productController");

const router = express.Router();

// for product fetch/Read
router.route("/products").get(getAllProducts);

// for product create
router.route("/product/new").post(createProduct); // import product APTS

// for product update
router.route("/product/:id").put(updateProduct); // this function we bring from "productController.js"


module.exports = router;