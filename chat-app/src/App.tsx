// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './components/Login';
import Chatpage from "./components/Chatpage";
import { useEffect, useState } from "react";
import { Message } from "./components/Message";
import GroupChat from "./components/GroupChat";
import { useSelector } from "react-redux";
import { RootState } from "./stateManagement/store";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.login.status)
  console.log('isLoggedIn:',isLoggedIn);
  
  const [userAuth, setUserAuth] = useState(false)
  useEffect(() => {
    let authPresent = sessionStorage.getItem('isUserAuthenticated');
    console.log(authPresent);

    if (authPresent === 'true' && typeof authPresent !== null) {
      console.log('authPresent:', authPresent);
      setUserAuth(true);
    }

    console.log('userAuth:', userAuth);

  }, [isLoggedIn])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={(isLoggedIn !== 'idle') ? <Chatpage /> : <Login />} >
          <Route path="/message/:friend" element={<Message />} />
          <Route path="/groupChats/:groupName" element={<GroupChat />} />
        </ Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
