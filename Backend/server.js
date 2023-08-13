const app = require('./app'); // import "app" from "app.js"
const dotenv = require('dotenv'); // import "dotenv" from "dotenv.js"
const connectDatabse = require("./config/database"); // import "connectDatabase" from "database.js"


//connect config by give path 
dotenv.config({path:"backend/config/config.env"});

// Connecting Database
// call "connectDatabase" function after set "config"
connectDatabse();

app.listen(process.env.PORT,() => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})



