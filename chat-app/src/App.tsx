// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './components/Login';
import Chatpage from "./components/Chatpage";
import { Messages} from "./components/Messages";
import { useSelector } from "react-redux";
import { RootState } from "./stateManagement/store";


function App() {
  const isLoggedIn = useSelector((state: RootState) => state.login.status)
  console.log('isLoggedIn:', isLoggedIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={(isLoggedIn !== 'idle' && isLoggedIn !== 'failed') ? <Chatpage /> : <Login />} >
          <Route path="/message/:indexName" element={<Messages />} />
          </ Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
