// here we inherits "ErrorHandler" with "Error" which is default error handler class of NodeJS 

// Using this we increse reusability of code---> no need to write multiple if-else in conroller files
class ErrorHander extends Error {
     constructor(message,statusCode) {
        super(message);

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
     }
}

module.exports = ErrorHander // import in Controller files