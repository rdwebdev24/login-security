
import {React,useState} from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Login } from "./components/Login";
import { Main } from "./components/Main";
import "./App.css";

function App() {
  const [user,SetUser] = useState('');
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login SetUser={SetUser} />} />
          <Route path="main" element={<Main user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
