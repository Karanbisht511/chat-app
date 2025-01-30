import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_API_URL;
// const URL = 'http://localhost:9000';
export const socket = io(URL, {
  path: "/api/socketio",
  addTrailingSlash: false,
  transports: ["websocket"],
});
