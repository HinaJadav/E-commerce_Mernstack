const app = require('./app'); // import "app" from "app.js"
const dotenv = require('dotenv'); // import "dotenv" from "dotenv.js"
const connectDatabse = require("./config/database"); // import "connectDatabase" from "database.js"

//----------------------------------------------------------------

// Uncaught exceptions:
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.massage}`);
    console.log(`Shutting down the server due to uncaught exception`);

    process.exit(1);
})


// console.log(x); --> for check uncaught exception


//connect config by give path 
dotenv.config({path:"backend/config/config.env"});

// Connecting Database
// call "connectDatabase" function after set "config"
connectDatabse();

// Server
const server = app.listen(process.env.PORT,() => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})


// Unhandle promise rejection:
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.massage}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
})




//----------------------------------------------------------------

// error type:

// 1) req. sending error --> errorHander
// 2) asyncrhon error --> catchAsyncError

// 3) Unhandled promise errors: (ex: change or incorret URI) ---> make this fun. at end of code
// somethimes this type error occure due change in DB_URI
// Effect of this type error on server is --> server not crash but it also not run properlly
// solution : sutdown terminal immediatlly  --> handle error using "errorhander" --> see "

// 4) Uncaught exception: (ex: console.log(y); --> if y not declare and we try to print it than this type error occure) 
// --> make/write in starting of code --> more effective or needed

// 5) MongoDB error: --> (CastError)
// ex: (req. ID is incorrect etc) 
// --> error.js