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
    
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});



// this import in "productRouter.js"


//Read/Get All Products
exports.getAllProducts = catchAsynErrors(async (req, res) => {

    const resultPerPage = 4; // means, howmany results in one page
    const productCount = await Product.countDocuments();
    
    const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search().filter().pagination(resultPerPage);

    const product = await apifeatures.query;
    
    res.status(200).json({
        success:true,
        product,
        productCount
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
exports.getProductDetails = catchAsynErrors(async(req,res,next) => {
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
    });
});


// create new review or update the review
exports.createProductReview = catchAsynErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating: Number(rating), // user give to product
        comment,
    };

    const product = await Product.findById(productId);


    const isReviewed = product.reviews.find(
        (rev) => ((rev.user.toString()) === (req.user._id.toString()))
    ); // rev.user : give userId which commented erilier

    if(isReviewed) {
        product.reviews.forEach(rev => {
            if((rev.user.toString()) === (req.user._id.toString())){
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    }
    else {
        // product.reviews.push(review);
        product.reviews = [...product.reviews, review];
        // product.numOfReviews += product.reviews.length;
    }
    product.numOfReviews = product.reviews.length;

    // all over product rating based on all users reviews

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;   

    await product.save({
        validateBeforeSave : false,
    });

    res.status(200).json({
        success: true,
    });

});

// Get All Reviews of a product
exports.getProductReviews = catchAsynErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
});

// Delete Review
exports.deleteReview = catchAsynErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // we select all those product which we don't want to delete
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    // update number of total reviews
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
});
  
//----------------------------------------------------------------
// Main benifit of "catchAsyncErrors" is that it catch asynchronous errors which is main reason for server termination or lost
// Due to this ErrorHander we able to catch error which throw by asynchronous code and Server is safe now...

