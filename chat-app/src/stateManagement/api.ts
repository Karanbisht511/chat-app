import axios from "axios";
const env = import.meta.env.NODE_ENV;
export const api = axios.create({
  baseURL:
    env === "production" ? "/api" : `${import.meta.env.VITE_API_URL}/api`,
});
