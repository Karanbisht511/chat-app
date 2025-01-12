import { useState } from "react"
import './Login.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router";
import { useAppDispatch } from "../../utils/utils";
import { forgotPassword, resetPassword } from "../../stateManagement/Authentication/Authentication";
import { Outlet } from "react-router";


export const ChangePassword = () => {

    return (
        <div className="loginPage-container">
            <div className="reset-wrapper" >
                <Outlet />
            </div>
        </div>
    )
}

export const Reset = () => {
    const { token } = useParams()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();

    const resetPasswordHandle = () => {
        if (token)
            dispatch(resetPassword({ username, password, token }))
    }
    return (
        <div className="login-box">
            <p className="login-text">Reset Password</p>
            <div className="inputs">
                <div className="round-corners input-wrapper" >
                    <FontAwesomeIcon icon={faUserCircle} /><input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                </div>
                <div className="round-corners input-wrapper" >
                    <FontAwesomeIcon icon={faLock} /><input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" />
                </div>
            </div>
            <div className="button-signin">
                <button className="round-corners" onClick={resetPasswordHandle}>Reset</button>
            </div>
        </div>
    )
}

export const Success = () => {
    return (<div className="login-box">
        <p className="login-text">Password Reset Successfully</p>
    </div>)
}

export const ForgotPassword = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const dispatch = useAppDispatch();

    const handleForgotPassword = () => {

        dispatch(forgotPassword({ username, email }))
    }
    return (
        <div className="login-box">
            <p className="login-text">Forgot Password</p>
            <div className="inputs">
                <div className="round-corners input-wrapper" >
                    <FontAwesomeIcon icon={faUserCircle} /><input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                </div>
                <div className="round-corners input-wrapper" >
                    <FontAwesomeIcon icon={faLock} /><input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                </div>
            </div>
            <div className="button-signin">
                <button className="round-corners" onClick={handleForgotPassword}>Send reset link</button>
            </div>
        </div>
    )
}
