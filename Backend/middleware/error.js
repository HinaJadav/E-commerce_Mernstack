const ErrorHandler = require('../utils/errorhander.js');


module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // MangoDB error handling

    if(err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //----------------------------------------------------------------
    // Mongoose duplicate key errors
    if(err.code == 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wronge JWT error
    if(err.code == "JsonWebTokenError") { 
        const message = `Json web token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }

    // JWT expired error
    if(err.code == "TokenExpiredError") { 
        const message = `Json web token is Expired, try again`;
        err = new ErrorHandler(message, 400);
    }

    //----------------------------------------------------------------




    res.status(err.statusCode).json({
        success: false,
        message: err.message, // only give error massage
        // error: err.stack, // it give exact location of error
    });
};







