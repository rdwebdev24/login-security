import React, { useState } from 'react'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { Loader } from './Loader';

export const Login = ({SetUser}) => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
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
        email: Data.get('email'),
        username: Data.get('username'),
        password: Data.get('password'),
      };
  
      if(userData.username=='' && userData.password=='') {alert(`username and password can't be empty`); return;}
      if(userData.username=='') {alert(`username can't be empty`); return;}
      if(userData.password=='') {alert(`password can't be empty`); return;}

     
      userData.password =  hash(userData.password);
      userData.username =  hash(userData.username);
      const ClientKey = hash(userData.password+userData.username+currentDomain);
      userData.ClientKey = ClientKey;
      setLoading(true);
      const {data} = await axios.post(`${url}/login`,userData);
      setLoading(false);
      if(data.status==400) {alert(data.msg); return;}
      if(data.status==201) {
        localStorage.setItem('ls-username',data.user.username)
        SetUser(data.user.username);
        navigate('/main');return
      }
      SetUser(data.user.username)
      if(data.status==200) {navigate('/main')}
    }
  return (
    <div className="main-block">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <hr />
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
        <hr />
        <div className="btn-block">
          <button  className="submit">{loading?<Loader/>:'Login'}</button>
        </div>
        <a href="#" onClick={()=>navigate('/register')}>register</a>
      </form>
    </div>
  )
}
