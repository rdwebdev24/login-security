const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
require("dotenv").config();
const { LoginUser } = require("./model/model");
const PORT = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
connectDB();

let user = [
  {
    username: "rohit123",
    password: "rohit@123",
  },
];

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(req.body, " body...");
    const oldUser = await LoginUser.find({ "user.username": username });
    console.log(oldUser, " : oldUser");

    if (oldUser.length != 0)
      return res.send({ msg: "login successfully",status:201, user: oldUser[0] });

    const userData = await LoginUser.create({
      user: { username, password },
    });
    return res.send({ msg: "login successfully",status:200, user:userData });
  } 
  catch (error) {
    console.log(error.Message);
  }
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
