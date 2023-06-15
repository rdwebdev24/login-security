import React from 'react'
import axios from "axios";
import {useNavigate} from 'react-router-dom'

export const Register = ({SetUser}) => {
    const navigate = useNavigate();
    var currentDomain = window.location.hostname;
    var url = 'http://localhost:5000'
  
    const hash = (value) => {
      var hash = CryptoJS.SHA256(value+currentDomain);
      var hashString = hash.toString();
      return hashString;
    }
    const handleSubmit = async (event) => {
      event.preventDefault();
      const Data = new FormData(event.currentTarget);
      const userData = {
        username: Data.get('username'),
        password: Data.get('password'),
        email: Data.get('email'),
      };
      const confirmpassword = Data.get('confirmpassword');

      if(userData.password!=confirmpassword){alert(`password dosen't match`); return;};
      if(userData.username=='' && userData.value=='') {alert(`username and password can't be empty`); return;}
      if(userData.username=='') {alert(`username can't be empty`); return;}
      if(userData.password=='') {alert(`password can't be empty`); return;}

     
      userData.password =  hash(userData.password);
      userData.username =  hash(userData.username);
      const ClientKey = hash(userData.password+userData.username+currentDomain);
      userData.ClientKey = ClientKey;
  
      const {data} = await axios.post(`${url}/register`,userData);
      if(data.status==400) {alert(data.msg); return;}
      if(data.status==200) {
        localStorage.setItem('ls-username',data.user.user.username)
        SetUser(data.user.user.username);
        navigate('/main');return
    }
      SetUser(data.user.user.username)
      if(data.status==200) {navigate('/main')}
    }
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
          type="text"
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
          id="name"
          placeholder="Email"
          required
        />
        <label id="icon" htmlFor="name">
          <i className="fas fa-unlock-alt"></i>
        </label>
        <input
          className="password"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
        />
        <label id="icon" htmlFor="name">
          <i className="fas fa-unlock-alt"></i>
        </label>
        <input
          className="confirmpassword"
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          placeholder="Confirm password"
        />
        <hr />
        <div className="btn-block">
          <button  className="submit">Submit</button>
        </div>
        <a href="#" onClick={()=>navigate('/login')}>login</a>
      </form>
    </div>
  )
}
