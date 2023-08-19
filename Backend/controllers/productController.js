const Product = require("../models/productModel") // import "productSchema" from productModel.js
const ErrorHander = require("../utils/errorhander.js") // import "errorHander" from errorhander.js
const catchAsynErrors = require("../middleware/catchAsyncErrors.js"); // import "errorHander" from catchAsyncErrors.js
const ApiFeatures = require("../utils/apifeatures.js"); 






//----------------------------------------------------------------




//Create Products --> Admin (means, Only Admin have access of this)

// w/o ErrorHander:

// exports.createProduct = async (req, res, next) => {
//     const product = await Product.create(req.body);

//     res.status(201).json({
//         success:true,
//         product
//     });
// }

// with ErrorHander
exports.createProduct = catchAsynErrors(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});



// this import in "productRouter.js"


//Read/Get All Products
exports.getAllProducts = catchAsynErrors(async (req, res) => {
    
    const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search().filter();

    const product = await apifeatures.query;
    
    res.status(200).json({
        success:true,
        product
    });
});


// Update Product --> Admin
exports.updateProduct = catchAsynErrors(async(req,res,next) => {
    // * when we use async function for solve error for that --> better to use try_catch block ---> for increase reusability make ErrorHander for this also

    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHander("Product not found", 404)); // callback function
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true,
        useFindAndModify:false 
    });

    res.status(200).json({
        sucess : true,
        product
    });
});


//Delete a product
exports.deleteProduct = catchAsynErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHander("Product not found", 404)); // callback function
    }

    await product.deleteOne();

    res.status(200).json({
        sucess:true,
        massage:"Product deleted successfully"
    });
});

//Get product details
exports.gerProductDetails = catchAsynErrors(async(req,res,next) => {
    const product = await Product.findById(req.params.id);

    // if(!product) {
    //     return res.status(500).json ({
    //         sucess:false,
    //         massage:"Product not found"
    //     })
    // }

    // Useing ErrorHandler we increase reusability here
    if(!product) {
        return next(new ErrorHander("Product not found", 404)); // callback function
    }

    
    res.status(200).json({
        sucess:true,
        product
    })
});




//----------------------------------------------------------------
// Main benifit of "catchAsyncErrors" is that it catch asynchronous errors which is main reason for server termination or lost
// Due to this ErrorHander we able to catch error which throw by asynchronous code and Server is safe now...

