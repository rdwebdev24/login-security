const mongoose =  require('mongoose');

const Schema = mongoose.Schema; 

const User = new Schema({
    email:{type:String,require:true},
    username:{ type: String, require:true },
    password:{ type: String ,require:true},
})
const LoginUser = mongoose.model("User",User)
module.exports = {LoginUser}
