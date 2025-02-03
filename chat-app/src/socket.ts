import { io } from "socket.io-client";
// "undefined" means the URL will be computed from the `window.location` object
// const URL = import.meta.env.VITE_API_URL;
// const URL = import.meta.env.VITE_API_URL2;
const env = import.meta.env.MODE;
const URL =
  env === "development" ? `${import.meta.env.VITE_API_URL}/api` : "/api";
export const socket = io(URL, {
  path: "/api/socketio",
  addTrailingSlash: false,
  transports: ["websocket", "polling"],
});
