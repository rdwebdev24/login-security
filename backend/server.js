const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const { LoginUser } = require("./model/model");
const CryptoJS = require('crypto-js');
const shuffle = require('./config/shuffle');

require("dotenv").config();
const PORT = 5000;

console.log(shuffle("rohit","123","dhakad",1234));

const app = express();
app.use(cors());
app.use(bodyParser.json());
connectDB();

app.post("/login", async (req, res) => {
  const { username, password , ClientKey, email} = req.body;

  const Hw = CryptoJS.SHA256(process.env.ServerKey).toString();
  const SecretKey = shuffle(ClientKey,Hw,process.env.ServerKey,198899);
  // const decryptedPassword = CryptoJS.AES.encrypt(password, SecretKey).toString();
  console.log({username,password,ClientKey}, ' login');
  try {
    const oldUser = await LoginUser.find({ "email": email });
    console.log({oldUser});
    
    if (oldUser.length != 0){
      console.log('afdsfs');
      const encryptedPassword = oldUser[0].password;
      const decryptedPasswordBytes = CryptoJS.AES.decrypt(encryptedPassword, SecretKey);
      const decryptedPassword = decryptedPasswordBytes.toString(CryptoJS.enc.Utf8);
      console.log({decryptedPassword,encryptedPassword,decryptedPasswordBytes});
      if(decryptedPassword==password) return res.send({ msg: "login successfully",status:201, user: oldUser[0] });
    }
    
    return res.send({msg:"user dosen't exist",status:400});
  }
  catch (error) {
    console.log(error.Message);
  }
});
app.post("/register", async (req, res) => {
  const { username, password , ClientKey , email} = req.body;
  console.log({username,password,ClientKey,email}, ' register');

  const Hw = CryptoJS.SHA256(process.env.ServerKey).toString();

  const SecretKey = shuffle(ClientKey,Hw,process.env.ServerKey,198899);

  const encryptedUsername = CryptoJS.AES.encrypt(username, SecretKey).toString();
  const encryptedPassword = CryptoJS.AES.encrypt(password, SecretKey).toString();
  console.log({encryptedUsername,encryptedPassword});
  try {
    const oldUser = await LoginUser.find({ "email": email });
    console.log({oldUser});

    if (oldUser.length != 0)
      return res.send({ msg: "user already exist please login",status:201, user: oldUser[0] });

    const userData = await LoginUser.create({
       email , username:encryptedUsername, password:encryptedPassword 
    });
    return res.send({ msg: "register successfully",status:200, user:userData });
  } 
  catch (error) {
    console.log(error.Message);
  }
  res.send({msg:"success"})
});

app.get("/", (req, res) => {
  res.status(200).send({ status: 200, msg: "success" });
});

app.get("/users", async (req, res) => {
    const user = await LoginUser.find();
    res.status(200).send({ msg: "success", user });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
