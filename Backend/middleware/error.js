const ErrorHandler = require('../utils/errorhander.js');


module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // MangoDB error handling

    if(err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }




    res.status(err.statusCode).json({
        success: false,
        message: err.message, // only give error massage
        // error: err.stack, // it give exact location of error
    });
};







