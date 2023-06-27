/* 
Objectives: 
Input:
Expected output:

Example 

*/


import React, { useEffect, useState } from 'react'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { Loader } from './Loader';
import {shuffle} from '../utils/shuffle'
import checkPassword from  '../utils/passCheck'

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
      var hash = CryptoJS.SHA256(value);
      var hashString = hash.toString();
      return hashString;
    }

    console.log(shuffle("rohit","123","dhakad",1234)," feotnend");

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
      if(!isvalidpassword) setPasswordAlert('password should be minimum of 10 characters contain 2 capital letter 2 special and 2 number')
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

      if(!checkPassword(userData.password)) {alert('password is weak');return}

      const confirmpassword = Data.get('confirmpassword');
      
      if(userData.password!=confirmpassword){alert(`password dosen't match`); return;};
      if(userData.username=='' && userData.value=='') {alert(`username and password can't be empty`); return;}
      if(userData.username=='') {alert(`username can't be empty`); return;}
      if(userData.password=='') {alert(`password can't be empty`); return;}

      let u = userData.username;
      let p = userData.password;
      let seed = 198899;

      console.log({u,p,email:userData.email,currentDomain});

      // console.log(userData," userdata");

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


//ripon@cse.nits.ac.in
//User@1991
//Pass@1975_P

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
