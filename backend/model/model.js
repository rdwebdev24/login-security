const mongoose =  require('mongoose');

const Schema = mongoose.Schema; 

const User = new Schema({
    user:{
      username:{ type: String, default: null },
      password:{ type: String ,require:true},
    }
})
const LoginUser = mongoose.model("User",User)
module.exports = {LoginUser}
