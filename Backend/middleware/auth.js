const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  //req.user = await User.findById(decodedData.id);
  req.user = await User.findById(decodedData.id);

  next();
});


exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
     
    //Admin not login
    if(!roles.includes(req.user.role)) {

      return next(
        new ErrorHander(
        `Role: ${req.user.role} is not allowed to access this resource`,
        403
        )
      );
      // 403 : means server understand what you want to do but --> server refuse that process
    }
    next();
  };
};

