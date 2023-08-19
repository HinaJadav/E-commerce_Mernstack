const mongoose = require('mongoose');



//make function for code of connection-DB 
const connectDatabse =() => {
    mongoose.connect(process.env.DB_URI, {
        // Below code is no longer needed in new Mongodb version--> if we use it, it give error --> bcz, they are not supported by MongoDB
        
        // userNewUrlParser:true,
        // userUnifiedTopology:true,
        // userCreateIndex:true,
        // useFindAndModify:false
    }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`)
    })
    // here no need to use catch after "Handel" uncatch error in --> using errorHandler method --> in "Server.js"
}

// export "connectDatabse" function --> import in "server.js"
module.exports = connectDatabse

