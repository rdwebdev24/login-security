import React, { useState } from 'react'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { Loader } from './Loader';
import { shuffle } from '../utils/shuffle';

export const Login = ({SetUser}) => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    var currentDomain = window.location.hostname;
    var url = 'http://localhost:5000'
  
    const hash = (value) => {
      var hash = CryptoJS.SHA256(value);
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

      console.log(userData," userdata");
  
      if(userData.username=='' && userData.password=='') {alert(`username and password can't be empty`); return;}
      if(userData.username=='') {alert(`username can't be empty`); return;}
      if(userData.password=='') {alert(`password can't be empty`); return;}

      let u = userData.username;
      let p = userData.password;
      let seed = 198899;

      console.log({u,p,email:userData.email,currentDomain});

      const hu = hash(u);
      const hp = hash(p);
      const hd = hash(currentDomain);

      const Su = shuffle(hu,hd,p,seed);
      const Sp = shuffle(hp,hd,u,seed);
      const Sk = shuffle(hu,hp+hd,p+u,seed);

      console.log({Su,Sp,Sk});

      const Hu = hash(Su);
      const Hp = hash(Sp);
      const Hk = hash(Sk);

      console.log({Hu,Hp,Hk});

      userData.username = Hu;
      userData.password = Hp;
      userData.ClientKey = Hk;


      // console.log(userData);
    
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
