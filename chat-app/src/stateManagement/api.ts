import axios from "axios";
const env = import.meta.env.MODE;
export const api = axios.create({
  baseURL:
    env === "development" ? `${import.meta.env.VITE_API_URL}/api` : "/api",
});
