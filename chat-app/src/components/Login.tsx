import { useState, SyntheticEvent } from "react"
import { useAppDispatch } from "../utils/utils";
import { loginUser } from "../stateManagement/Authentication/loginSlice";
import './Login.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

function Login() {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const LoginUser = async (e: SyntheticEvent) => {
        e.preventDefault();
        const payload = { username, password }
        dispatch(loginUser(payload));
    }

    return (
        <div className="loginPage-container">
            <div className="login-wrapper" >
                <div className="login-box">
                    <p className="login-text">Login</p>
                    <div className="inputs">
                        <div className="round-corners input-wrapper" >
                            <FontAwesomeIcon icon={faUserCircle} /><input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                        </div>
                        <div className="round-corners input-wrapper" >
                            <FontAwesomeIcon icon={faLock} /><input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                        </div>
                    </div>
                    <div className="button-signin">
                        <button className="round-corners" onClick={LoginUser}>Sign in</button>
                    </div>
                    <div>
                        <button>Forgot your password?</button>
                    </div>
                </div>
            </div>
            <div className="text-detail">
                <div className="detail">
                    <div className="text-header">Messenger</div>
                    <div className="message-text">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. At sed neque eveniet, iure minima, officia quisquam molestiae molestias quis assumenda eum magnam distinctio incidunt minus. Numquam dignissimos perspiciatis iste nisi?
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
