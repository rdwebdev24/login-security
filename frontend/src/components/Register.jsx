/************************************************************
Objectives: sending hashed username password and Client key to the server 
after doing some hashign and shuffling 

Input: Username , email and  password 

Expected output: Status code 200 ( user successfully registered )

Example : 
// USERNAME (u) : rohitdhakad
// PASSWORD (p) : ROhitdhakad20@@
// EMAIL : user123@gmail.com

username --> hash --> shuffle --> hash --> send to server 
password --> hash --> shuffle --> hash --> send to server 

**************************************************************/

// importing the requried libraries //
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loader";
import { shuffle } from "../utils/shuffle";
import checkPassword from "../utils/passCheck";

// exporting the register component to the App component
export const Register = ({ SetUser }) => {
  // for navigation between pages
  const navigate = useNavigate();

  // Initialising some states ( variables )
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [ConfirmpasswordAlert, setConfirmpasswordAlert] = useState("");
  const [loading, setLoading] = useState(false);

  // getting the current domain ( for hasing and shuffling )
  var currentDomain = window.location.hostname;
  var url = "http://localhost:5000";

  // Hashing function which uses crypto SHA256
  const hash = (value) => {
    var hash = CryptoJS.SHA256(value);
    var hashString = hash.toString();
    return hashString;
  };

  // Function which run when user click on register button
  const handleSubmit = async (event) => {
    // prevernting default action ( reloading )
    event.preventDefault();

    // Getting the user details from the form
    const Data = new FormData(event.currentTarget);
    const userData = {
      username: Data.get("username"),
      password: Data.get("password"),
      email: Data.get("email"),
    };

    // Checking the password strength
    if (!checkPassword(userData.password)) {
      alert(
        "password is weak should be of length 10 having minimum 2 capital letters , 2 numbers , 2 special characters"
      );
      return;
    }

    // checking  the username length ( min 9 character )
    if (userData.username.length < 8) {
      alert("username should be of length 8");
      return;
    }

    // getting the comfirm password in userData
    const confirmpassword = Data.get("confirmpassword");

    // confirmation of the password
    if (userData.password != confirmpassword) {
      alert(`password dosen't match`);
      return;
    }

    // Checking if any field is empty or not
    if (userData.username == "" && userData.value == "") {
      alert(`username and password can't be empty`);
      return;
    }
    if (userData.username == "") {
      alert(`username can't be empty`);
      return;
    }
    if (userData.password == "") {
      alert(`password can't be empty`);
      return;
    }

    // storing the username and password in some variable

    let u = userData.username;
    let p = userData.password;

    // and initialising the seed value
    let seed = 198899;

    // hashing the username , password and current domain
    const hu = hash(u);
    const hp = hash(p);
    const hd = hash(currentDomain);

    // Shuffling the hashed username and hashed domain in ctx of password with some seed value
    const Su = shuffle(hu, hd, p, seed);

    // Shuffling the hashed password and hashed domain in ctx of username with some seed value
    const Sp = shuffle(hp, hd, u, seed);

    // Shuffling the hashed username and ( hashed passowrd + hashed domain)
    // in ctx of ( passowrd + username )  with some seed value
    const Sk = shuffle(hu, hp + hd, p + u, seed);

    // Hashign the shuffled value of username , password and client key
    const Hu = hash(Su);
    const Hp = hash(Sp);
    const Hk = hash(Sk);

    // assigning the Hashed value to the userData for sending to server
    userData.username = Hu;
    userData.password = Hp;
    userData.ClientKey = Hk;

    // setting loading true while response is coming
    setLoading(true);

    // getting the response in data //
    const { data } = await axios.post(`${url}/register`, userData);

    // set  loading false
    setLoading(false);

    // if Status code  400 user Already exist
    if (data.status == 400) {
      alert(data.msg);
      return;
    }

    // if Status code 200 user registered
    if (data.status == 200) {
      localStorage.setItem("ls-username", data.user.username);
      SetUser(data.user.username);
      navigate("/main");
      return;
    }
  };

  // UserEffect runs when the page rendered
  useEffect(() => {
    // cheking whether the user is entering the correct password or not
    if (confirmpassword != password)
      setConfirmpasswordAlert(`password dosen't match`);
    else setConfirmpasswordAlert("");
  }, [confirmpassword]);

  // Returning the register component
  return (
    <div className="main-block">
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <hr />
        <label id="icon" htmlFor="name">
          <i className="fas fa-user"></i>
        </label>
        <input
          className="username"
          type="password"
          name="username"
          id="name"
          placeholder="UserName"
          required
        />
        <label id="icon" htmlFor="name">
          <i className="fas fa-user"></i>
        </label>
        <input
          className="username"
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <label id="icon" htmlFor="name">
          <i className="fas fa-unlock-alt"></i>
        </label>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="password"
          type="password"
          name="password"
          id="password"
          placeholder="eg., password : USername@#123"
          required
        />
        <label id="icon" htmlFor="name">
          <i className="fas fa-unlock-alt"></i>
        </label>
        <input
          value={confirmpassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          className="confirmpassword"
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          placeholder="Confirm password"
        />
        <p
          style={{
            marginBottom: "0.7rem",
            fontSize: "1.05rem",
            color: "crimson",
            marginTop: "-10px",
          }}
        >
          {ConfirmpasswordAlert}
        </p>
        <hr />
        <div className="btn-block">
          <button className="submit">
            {loading ? <Loader /> : "Register"}
          </button>
        </div>
        <a href="#" onClick={() => navigate("/login")}>
          login
        </a>
      </form>
    </div>
  );
};
