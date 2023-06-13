import axios from 'axios';
import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

export const Main = ({user}) => {
  const url = 'http://localhost:5000';
  const navigate = useNavigate();

  const logout = async () => {
    localStorage.removeItem('ls-username');
    navigate('/login');
  }
  useEffect(()=>{
    const username = localStorage.getItem('ls-username');
    console.log(username," usernmae");
    if(!username) {alert('session expired');navigate('/login')}
    
  },[])
  return (
    <div>
        <h1>Welcome to Login security</h1>
        <h1>{user}</h1>
        <button onClick={logout}>Logout</button>
    </div>
  )
}
