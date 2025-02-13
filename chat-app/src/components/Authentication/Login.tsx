import { useState, SyntheticEvent } from "react";
import { useAppDispatch } from "../../utils/utils";
import { loginUser } from "../../stateManagement/Authentication/Authentication";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

export default function Login() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("user22");
  const [password, setPassword] = useState("passWord");

  // const [username, setUsername] = useState("Rahul");
  // const [password, setPassword] = useState("rahulPass");


  const LoginUser = async (e: SyntheticEvent) => {
    e.preventDefault();
    const payload = { username, password };
    dispatch(loginUser(payload));
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
          {/* App Name/Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Chat App</h1>
            <p className="text-zinc-400 mt-2">Welcome back!</p>
          </div>

          <form onSubmit={LoginUser} className="space-y-6">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign in
            </button>

            {/* Additional Links */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <Link 
                to="/changePassword/forgotPassword"
                className="text-blue-500 hover:text-blue-400 transition-colors text-sm"
              >
                Forgot your password?
              </Link>
              <div className="text-zinc-400 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/signup"
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
