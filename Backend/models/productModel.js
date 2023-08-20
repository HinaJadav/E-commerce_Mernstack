const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Please Enter Product Name"], // "[true, "Please Enter Product Description"]" --> this is array of values
        trim:true, // show in "Information.txt"
    },
    description: {
        type:String,
        required:[true, "Please Enter Product Description"]
    },
    price: {
        type:Number,
        required:[true, "Please Enter Product Price"],
        maxLenght: [8, "Price cannot exceed 8 characters"]
    },
    ratings : {
        type:Number,
        default:0
    },
    images: [ // more then one image --> make images Array
        { 
        // from where we get "public_id"--> when we upload our image on "cloudMemory" , At that time we get "public_id" and "url" for every images
            public_id: { 
                type:String,
                required:true
            },
            url: {
                type:String,
                required:true
            }
        }
    ],
    category: {
        type:String,
        required:[true, "Please select a category"]
        // category choose task we can do in two ways
        //1) manually
        //2) using "enum"
        // but we not do this part here --> we do it in backend
    },
    Stock: {
        type:String,
        required:[true, "Please Enter product stock"],
        maxLenght:[4, "Stock cannot exceed 4 characters"],
        default:1
    },
    numOfReviews: {
        type:Number,
        default:0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type:String,
                required:true
            },
            rating: {
                type:Number,
                required:true
            },
            comment: {
                type:String,
                required:true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: { // when product is created
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product", productSchema); // export productAPI , import in "Contollers"