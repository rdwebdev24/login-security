/******************************************************

This file is responsible for establishing a connection
with the MongoDB database using Mongoose library

*****************************************************/

const mongoose =  require('mongoose');
const colors = require("colors");

// Disable strict mode for queries (optional)
mongoose.set('strictQuery', false);

// Export the connectDB function
module.exports =  connectDB => {
  mongoose.connect(process.env.MONGO_URI,function(err) {
     if (err) {
       // Display error message if connection fails
       console.log(`${err} 😫`.red.bold);
     }else{
      // Display success message if connection is successful
       console.log("Connected to MongoDB 🔥 ".cyan.bold); 
     }
   });
}
