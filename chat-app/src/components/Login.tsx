import { useState } from "react"
import { Link } from "react-router"
import axios from "axios";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const loginRes;

    const LoginUser = async () => {
        const payload = { username, password }
        try {
            const loginRes = await axios.post('http://localhost:9000/api/users/login', payload);
            console.log('Result:', loginRes.data);
            sessionStorage.setItem('JWTToken', loginRes.data?.token)
            sessionStorage.setItem('isUserAuthenticated', loginRes.data?.isUserAuthenticated)
            sessionStorage.setItem('username', loginRes.data?.username)
            window.location.reload();
        } catch (error) {
            console.log("error:", error);
        }
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
