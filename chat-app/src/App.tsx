import { BrowserRouter, Routes, Route } from "react-router";
import Login from './components/Authentication/Login';
import Chatpage from "./components/Chatpage";
import { Messages } from "./components/Messages";
import { useSelector } from "react-redux";
import { RootState } from "./stateManagement/store";
import { ForgotPassword, ChangePassword, Success, Reset } from "./components/Authentication/ResetPassword";
import Signup from "./components/Authentication/Signup";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.login.loginState.status)
  console.log('isLoggedIn:', isLoggedIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={(isLoggedIn !== 'idle' && isLoggedIn !== 'failed') ? <Chatpage /> : <Login />} >
          <Route path="/message/:indexName" element={<Messages />} />
        </ Route>
        <Route path="signup" element={<Signup />} />
        <Route path="/changePassword" element={<ChangePassword />}>
          <Route path="forgotPassword" element={<ForgotPassword />} />
        </Route>
        <Route path="resetPassword" element={<ChangePassword />}>
          <Route path='success' element={<Success />} />
          <Route path=':token' element={<Reset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
