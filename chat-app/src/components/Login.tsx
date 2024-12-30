import { useState,SyntheticEvent } from "react"
import { Link } from "react-router"
import { useAppDispatch } from "../utils/utils";
import { loginUser } from "../stateManagement/authenticationSlice";

function Login() {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const loginRes;

    const LoginUser = async (e:SyntheticEvent) => {
        e.preventDefault();
        const payload = { username, password }
        dispatch(loginUser(payload));
    }

    return (
        <div>
            <p>Login Page</p>
            <div>
                username: <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} />
                Password: <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button onClick={LoginUser}>login</button>
            <button> <Link to="/chatpage">chatpage</Link></button>

        </div>
    )
}

export default Login
