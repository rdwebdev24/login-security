/***************************************************

Created Login and Register Routes for getting the userData 
from the client side

Process : 
1. getting the hashed username , passowrd , email and clientkey from client side
2. creating a new Secret key using hashed server key and client key
3. encrypting the username and password using the Secret key

*****************************************************/

// IMPORTING THE REQUIRED LIBRARIES //
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const { LoginUser } = require("./model/model");
const CryptoJS = require("crypto-js");
const shuffle = require("./config/shuffle");
const murmur = require("murmurhash-js");
const argon2 = require("argon2");
const hashSecretKey = require("./utils/argonHash");
const assignWhiteSpace = require("./utils/assignWhiteSpacce");
require("dotenv").config();

const PORT = 5000;

// INITIALISING THE EXPRESS SERVER  AND CORS //
const app = express();
app.use(cors());
app.use(bodyParser.json());

// CONNECTING THE DATABASE //
connectDB();

// LOGIN ROUTE //
app.post("/login", async (req, res) => {
  // Getting the username , password , email and client Key //
  var { username, password, ClientKey, email } = req.body;
  // hasing the server key //
  var Hw = CryptoJS.SHA256(process.env.ServerKey).toString();

  // shuffling the client key with the hashed server key in ctx of server key //
  var shuffledKey = shuffle(ClientKey, Hw, process.env.ServerKey, 198899);

  // Creating the secret key by hashing the shuffled key //
  var SecretKey = CryptoJS.SHA512(shuffledKey).toString();
  var n = (murmur.murmur2(process.env.ServerKey, 71287) % 2087) + 1000;
  for (let i = 0; i < n; i++) {
    SecretKey = CryptoJS.SHA512(SecretKey).toString();
  }

  // hashing the Secret key using Argon2i algorithm //
  SecretKey = await hashSecretKey(SecretKey, ClientKey);

  try {
    // checking for old user in Database //
    const oldUser = await LoginUser.find({ email: email });

    console.log({ oldUser });

    if (oldUser.length != 0) {
      var encryptedPassword = oldUser[0].password;
      var encryptedUsernmae = oldUser[0].username;
      /*********************************
       if the password or the username is different then the 
       decryptedPasswordBytes and decryptedUsernameBytes will
      not resolve and give undefined 
       so to handle this we use another try catch
      *********************************/
      try {
        // Decrypting the password using the Secret key //
        var decryptedPasswordBytes = CryptoJS.AES.decrypt(encryptedPassword,SecretKey)
        var decryptedPassword = decryptedPasswordBytes.toString(CryptoJS.enc.Utf8);
        
        // Decrypting the Username using the Secret key //
        var decryptedUsernameBytes = CryptoJS.AES.decrypt(encryptedUsernmae,SecretKey);
        var decryptedUsername = decryptedUsernameBytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.log(error);
      }

      // checking if the decrypted password and Username match the original one //
      if (decryptedPassword == password && decryptedUsername == username) {
        /************************************************
		We do not delete the variable. Instead, we replace the 
		characters using white spaces such that no one can 
		recover data from the used variables. This is securely
		erasing the content of the variables. 
	
		FUNCTION "assignWhiteSpace" replaces all the characters
		of the variables using white spaces.
		**************************************************/

    // as the decryptedPasswordBytes and decryptedUsernameBytes 
    // is a buffer object containing word ( an array ) and signByte ( number ) 
    //  so we cannot use assignwhitespace funciton ( as it is only for string values )
        decryptedPasswordBytes.words = [];
        decryptedPasswordBytes.sigBytes = null;

        decryptedUsernameBytes.words = [];
        decryptedUsernameBytes.sigBytes = null;

        decryptedPassword = assignWhiteSpace(decryptedPassword);
        decryptedPassword = "";

        encryptedPassword = assignWhiteSpace(encryptedPassword);
        encryptedPassword = "";

        encryptedUsernmae = assignWhiteSpace(encryptedUsernmae);
        encryptedUsernmae = "";

        decryptedUsername = assignWhiteSpace(decryptedUsername);
        decryptedUsername = "";

        return res.send({
          msg: "login successfully",
          status: 200,
          user: oldUser[0],
        });
      }
    }
    // sending the response to the client //
    return res.send({ msg: "user dosen't exist", status: 400 });
  } catch (error) {
    console.log(error.Message);
  } finally {
    /************************************************
	We do not delete the variable. Instead, we replace the 
	characters using white spaces such that no one can 
	recover data from the used variables. This is securely
	erasing the content of the variables. 
	
	FUNCTION "assignWhiteSpace" replaces all the characters
	of the variables using white spaces.
	**************************************************/
    SecretKey = assignWhiteSpace(SecretKey);
    SecretKey = "";
    ClientKey = assignWhiteSpace(ClientKey);
    ClientKey = "";
    shuffledKey = assignWhiteSpace(shuffledKey);
    shuffledKey = "";
    Hw = assignWhiteSpace(Hw);
    Hw = "";
    n = null;
  }
});

// REGISTER ROUTE //
app.post("/register", async (req, res) => {
  // getting the username , password , email and client key //
  var { username, password, ClientKey, email } = req.body;

  // hashing the server key //
  var Hw = CryptoJS.SHA256(process.env.ServerKey).toString();

  // Shuffling the client key with hashed server key in ctx of server key with some seed value
  var shuffledKey = shuffle(ClientKey, Hw, process.env.ServerKey, 198899);

  // Again hasing the shufled key using SHA256 and murmur function //
  var SecretKey = CryptoJS.SHA512(shuffledKey).toString();
  var n = (murmur.murmur2(process.env.ServerKey, 71287) % 2087) + 1000;
  for (let i = 0; i < n; i++) {
    SecretKey = CryptoJS.SHA512(SecretKey).toString();
  }

  // hashing the Secret key using Argon2i algorithm //
  SecretKey = await hashSecretKey(SecretKey, ClientKey);
  // encrypting the username and password using the secret key //
  var encryptedUsername = CryptoJS.AES.encrypt(username, SecretKey).toString();
  var encryptedPassword = CryptoJS.AES.encrypt(password, SecretKey).toString();

  try {
    // checking for the old user using email //
    const oldUser = await LoginUser.find({ email: email });

    // return if user already exist //
    if (oldUser.length != 0)
      return res.send({
        msg: "user already exist please login",
        status: 400,
        user: oldUser[0],
      });

    // Creating a new User with encrypted username and encrypted password
    const userData = await LoginUser.create({
      email,
      username: encryptedUsername,
      password: encryptedPassword,
    });

    // sending the response to the client side //
    return res.send({
      msg: "register successfully",
      status: 200,
      user: userData,
    });
  } catch (error) {
    console.log(error.Message);
  } finally {
    /************************************************
	We do not delete the variable. Instead, we replace the 
	characters using white spaces such that no one can 
	recover data from the used variables. This is securely
	erasing the content of the variables. 
	
	FUNCTION "assignWhiteSpace" replaces all the characters
	of the variables using white spaces. 
	**************************************************/
    SecretKey = assignWhiteSpace(SecretKey);
    SecretKey = "";
    ClientKey = assignWhiteSpace(ClientKey);
    ClientKey = "";
    shuffledKey = assignWhiteSpace(shuffledKey);
    shuffledKey = "";
    Hw = assignWhiteSpace(Hw);
    Hw = "";
    n = null;
    encryptedPassword = assignWhiteSpace(encryptedPassword);
    encryptedPassword = "";
    encryptedUsername = assignWhiteSpace(encryptedUsername);
    encryptedUsername = "";
  }
});

app.get("/", (req, res) => {
  res.status(200).send({ status: 200, msg: "success" });
});

// For getting all the users ( just created this route for checking purpose )
app.get("/users", async (req, res) => {
  const user = await LoginUser.find();
  res.status(200).send({ msg: "success", user });
});

// startin the server at given PORT //
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
