const Product = require("../models/productModel") // impoet "productSchema" from productModel.js


//Create Products --> Admin (means, Only Admin have access of this)
exports.createProduct = async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
}
// this import in "productRouter.js"


//Read/Get All Products
exports.getAllProducts = async (req, res) => {
    const product = await Product.find();
    res.status(200).json({
        success:true,
        product
    })
}


// Update Product --> Admin
exports.updateProduct = async(req,res,next) => {

    let product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(500).json ({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true,
        useFindAndModify:false 
    });

    res.status(200).json({
        sucess : true,
        product
    })
}



