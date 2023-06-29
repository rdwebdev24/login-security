// Importing the required libraries
import axios from 'axios';
import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'


// Exporting the Main component to App component 
export const Main = ({user}) => {

  const url = 'http://localhost:5000';
  const navigate = useNavigate();

  // LOGOUT FUNCTION
  // Removing the username from local storage and navigate to login page
  const logout = async () => {
    localStorage.removeItem('ls-username');
    navigate('/login');
  }

  // Run after the page is entered 
  useEffect(()=>{
    const username = localStorage.getItem('ls-username');
    if(!username) {alert('session expired');navigate('/login')}
    
  },[])

  // Returing the home page of login security
  return (
    <div>
        <h1>welcome to login security <br/> Homepage</h1>
        <button onClick={logout}>Logout</button>
    </div>
  )
}
