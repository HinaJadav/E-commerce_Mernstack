const app = require('./app');



const dotenv = require('dotenv');
//connect config by give path 
dotenv.config({path:"backend/config/config.env"});


app.listen(process.env.PORT,() => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})