import React from "react";
import {useNavigate} from 'react-router-dom'

// Landing page component
export const Landing = () => {
    const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to login security</h1>
      <button onClick={() => navigate("/register")}>Enter</button>
    </div>
  );
};
