const ErrorHander = require("../utils/errorhander.js") // import "errorHander" from errorhander.js
const catchAsynErrors = require("../middleware/catchAsyncErrors.js"); // import "errorHander" from catchAsyncErrors.js
const User = require("../models/userModel"); 
const sendToken = require("../utils/jwtToken"); 
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//----------------------------------------------------------------

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

    const isPasswordMatched = await user.comparePassword(password);

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



// Forgot Password
exports.forgotPassword = catchAsynErrors(async (req, res, next) => {
    
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    // save password 
    await user.save({
        validateBeforeSave: false
    });

    // email for sending link to reset password

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Possword Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({
            validateBeforeSave: false
        });

        return next(
            new ErrorHander(error.message,500)
        );
    }
});

//Reset Password
exports.resetPassword = catchAsynErrors(async (req, res, next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // User found
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });

    // User not found

    if(!user) {
        return next(new ErrorHander("Reset Password Token is invalide or has been expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

}); 


// Get User details
exports.getUserDetails = catchAsynErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    // here, always user has existence

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Password
exports.updatePassword = catchAsynErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    // here, always user has existence
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match.",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// Update User Profile
exports.updateProfile = catchAsynErrors(async (req, res, next) => {

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };

    // we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators:true,
        useFindAndModify:false,

    });

    res.status(200).json({
        success:true
    });
});


// Get All User details --> Admin
exports.getAllUser = catchAsynErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get Single User details --> Admin
exports.getSingleUser = catchAsynErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(
            new ErrorHander(`User does not exist with id ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});


// update user role -- admin
exports.updateUserRole = catchAsynErrors(async (req, res, next) => {

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };

    // we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators:true,
        useFindAndModify:false,

    });

    res.status(200).json({
        success:true
    });
});


// delete user -- Admin
exports.deleteUser = catchAsynErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    // we will delete cloudinary later
   
    // if user not found
    if(!user) {
        return next(new ErrorHander(`User does not exist with Id ${req.params.id}`));
    }

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message: "User deleted successfully",
    });
});

