import { useState, SyntheticEvent } from "react";
import { useAppDispatch } from "../../utils/utils";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { signup } from "../../stateManagement/Authentication/Authentication";
import Tagline from "./Tagline";
import { useNavigate } from "react-router";

function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const LoginUser = async (e: SyntheticEvent) => {
    e.preventDefault();
    const payload = { username, password, email, mobile };
    dispatch(signup(payload));
    navigate("/");
  };

  return (
    <div className="loginPage-container">
      <div className="login-wrapper">
        <div className="login-box">
          <p className="login-text">Signup</p>
          <div className="inputs">
            <div className="round-corners input-wrapper">
              <FontAwesomeIcon icon={faUserCircle} />
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="round-corners input-wrapper">
              <FontAwesomeIcon icon={faLock} />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="round-corners input-wrapper">
              <span>&#x2709;</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="round-corners input-wrapper">
              <span>&#x260E; </span>
              <input
                type="mobile"
                name="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Phone no"
              />
            </div>
          </div>
          <div className="button-signin">
            <button className="round-corners" onClick={LoginUser}>
              Create Account
            </button>
          </div>
        </div>
      </div>

      <Tagline />
    </div>
  );
}

export default Signup;
