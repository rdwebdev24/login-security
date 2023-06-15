import React, { useEffect, useState } from 'react'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { Loader } from './Loader';

export const Register = ({SetUser}) => {
    const navigate = useNavigate();
    const [password,setPassword] = useState('');
    const [confirmpassword,setConfirmPassword] = useState('');
    const [passwordAlert,setPasswordAlert] = useState('');
    const [ConfirmpasswordAlert,setConfirmpasswordAlert] = useState('');
    const [loading,setLoading] = useState(false);
    var currentDomain = window.location.hostname;
    var url = 'http://localhost:5000'
  
    const hash = (value) => {
      var hash = CryptoJS.SHA256(value+currentDomain);
      var hashString = hash.toString();
      return hashString;
    }
    const validatePassword = (password) => {
      const specialCharPattern = /[!@#$%^&*(),._?":;{}|<\/>=+-]/;
      const capitalLetterPattern = /[A-Z]/;
      const containsSpecialChar = specialCharPattern.test(password);
      const containsCapitalLetter = capitalLetterPattern.test(password);
      const passLength = password.length>=7 && password.length <= 32;
      console.log({containsSpecialChar,containsCapitalLetter,passLength});

      return containsSpecialChar && containsCapitalLetter && passLength
    }
    const HandlepasswordChange = (e) => {
      setPassword(e.target.value);
      const isvalidpassword = validatePassword(password)
      console.log(isvalidpassword);
      if(!isvalidpassword) setPasswordAlert('password should be minimum of 8 characters contain one capital letter one special')
      else setPasswordAlert('')
    }
    const HandleConfirmPassword = (e) => {
      setConfirmPassword(e.target.value);
      console.log(confirmpassword);
      
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
      setLoading(true);
      const {data} = await axios.post(`${url}/register`,userData);
      setLoading(false);
      console.log(data);
      if(data.status==400) {alert(data.msg); return;}
      if(data.status==200) {
        localStorage.setItem('ls-username',data.user.username)
        SetUser(data.user.username);
        navigate('/main');return
    }
      SetUser(data.user.username)
      if(data.status==200) {navigate('/main')}
    }

    useEffect(()=>{
      if(confirmpassword!=password) setConfirmpasswordAlert(`password dosen't match`)
      else setConfirmpasswordAlert('')
    },[confirmpassword])
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
          value={password}
          onChange={(e)=>HandlepasswordChange(e)}
          className="password"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
        />
        <p style={{marginBottom:'0.7rem', fontSize:'1.05rem', color:'crimson', marginTop:'-10px'}}>{passwordAlert}</p>
        <label id="icon" htmlFor="name">
          <i className="fas fa-unlock-alt"></i>
        </label>
        <input
          value={confirmpassword}
          onChange={(e)=>HandleConfirmPassword(e)}
          className="confirmpassword"
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          placeholder="Confirm password"
        />
         <p style={{marginBottom:'0.7rem', fontSize:'1.05rem', color:'crimson', marginTop:'-10px'}}>{ConfirmpasswordAlert}</p>
        <hr />
        <div className="btn-block">
          <button  className="submit">{loading?<Loader/>:'Register'}</button>
        </div>
        <a href="#" onClick={()=>navigate('/login')}>login</a>
      </form>
    </div>
  )
}
