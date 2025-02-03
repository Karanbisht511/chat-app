import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router";
import { useAppDispatch } from "../../utils/utils";
import {
  forgotPassword,
  resetPassword,
} from "../../stateManagement/Authentication/Authentication";
import { Outlet, Link } from "react-router";

// Base styles that can be used across components
const containerStyles =
  "min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4";
const cardStyles = "w-full max-w-md bg-zinc-900 rounded-lg p-8 shadow-lg";
const titleStyles = "text-2xl font-bold text-white text-center mb-2";
const subtitleStyles = "text-zinc-400 text-center mb-8";
const inputContainerStyles = "relative mb-4";
const inputStyles =
  "w-full bg-zinc-800 text-white rounded-md py-2 pl-10 pr-4 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
const buttonStyles =
  "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors";

export const ChangePassword = () => {
  return (
    <div className={containerStyles}>
      <div className={cardStyles}>
        <Outlet />
      </div>
    </div>
  );
};

export const Reset = () => {
  const { token } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const resetPasswordHandle = () => {
    if (token) dispatch(resetPassword({ username, password, token }));
  };

  return (
    <div>
      <h1 className={titleStyles}>Reset Password</h1>
      <div className="space-y-4">
        <div className={inputContainerStyles}>
          <FontAwesomeIcon
            icon={faUserCircle}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={inputStyles}
          />
        </div>
        <div className={inputContainerStyles}>
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className={inputStyles}
          />
        </div>
        <button className={buttonStyles} onClick={resetPasswordHandle}>
          <Link to="/">Reset</Link>
        </button>
      </div>
    </div>
  );
};

export const Success = () => {
  return (
    <div>
      <h1 className={titleStyles}>Password Reset Successfully</h1>
      <p className={subtitleStyles}>You can now login with your new password</p>
    </div>
  );
};

export const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();

  const handleForgotPassword = () => {
    dispatch(forgotPassword({ username, email }));
  };

  return (
    <div>
      <h1 className={titleStyles}>Forgot Password</h1>
      <p className={subtitleStyles}>Enter your details to reset password</p>
      <div className="space-y-4">
        <div className={inputContainerStyles}>
          <FontAwesomeIcon
            icon={faUserCircle}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={inputStyles}
          />
        </div>
        <div className={inputContainerStyles}>
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputStyles}
          />
        </div>
        <button className={buttonStyles} onClick={handleForgotPassword}>
          <Link to="/">Send reset link</Link>
        </button>
      </div>
    </div>
  );
};
