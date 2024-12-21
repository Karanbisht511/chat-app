// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './components/Login';
import Chatpage from "./components/Chatpage";
import './App.css'
import { useEffect, useState } from "react";

function App() {
  const [userAuth, setUserAuth] = useState(false)
  useEffect(() => {
    let authPresent = sessionStorage.getItem('isUserAuthenticated');
    console.log(authPresent);

    if (authPresent === 'true' && typeof authPresent !== null) {
      console.log('authPresent:', authPresent);
      setUserAuth(true);
    }

    console.log('userAuth:', userAuth);

  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userAuth ? <Chatpage /> : <Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
