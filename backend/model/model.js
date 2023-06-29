/*************************************************

Creatin a model for Mogodb database using mongoose library 

Process :
1. Import the required library 
2. create a schema ( structure ) for the database
3. model the structure using mongoose.model function 

**************************************************/

// importing the library //
const mongoose =  require('mongoose');

// initialising the schema instance //
const Schema = mongoose.Schema; 

// Creating the user schema ( structure )
const User = new Schema({
    email:{type:String,require:true},
    username:{ type: String, require:true },
    password:{ type: String ,require:true},
})

// creating the user model ( collection )
const LoginUser = mongoose.model("User",User)

// exporting it for using in other files
module.exports = {LoginUser}
