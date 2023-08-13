const Product = require("../models/productModel") // impoet "productSchema" from productModel.js


//create product
exports.createProduct = async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201),json({
        success:true,
        product
    })
}




exports.getAllProducts = (req,res) => {
    res.status(200).json({message: "Route is working fine."});
};