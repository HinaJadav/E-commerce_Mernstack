const ErrorHander = require("../utils/errorhander.js") // import "errorHander" from errorhander.js
const catchAsynErrors = require("../middleware/catchAsyncErrors.js"); // import "errorHander" from catchAsyncErrors.js
const User = require("../models/userModel.js"); // import "
const sendToken = require("../utils/jwtToken.js"); // import "
// Register User

exports.registerUser = catchAsynErrors(async (req,res,next) => {
    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a simple ID",
            url: "profilepicUrl",
        },
    });

    sendToken(user, 201, res);
});


// Login User

exports.loginUser = catchAsynErrors(async (req,res,next) => {

    const {email,password} = req.body;

    // checking if user has given password and email both

    if(!email || !password) {
        return next(new ErrorHander("Please Enter Email and Password", 400));
    }

    const user = await User.findOne({email}).select("+password"); // Why "+" put before password bcz, when we decalre password it "set = true"

    // User not found
    if(!user) {
        return next(new ErrorHander("Invalid Email or Password", 401));
    }

    const isPasswordMatched = user.comparePassword(password);

    // Password not matched
    if(!isPasswordMatched) {
        return next(new ErrorHander("Invalid Email or Password", 401));
    }

    // Password matched
    sendToken(user, 200, res);

});





// Logout User
exports.logout = catchAsynErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
});
