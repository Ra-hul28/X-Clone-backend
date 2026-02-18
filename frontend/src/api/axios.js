import axios from "axios";

const api = axios.create({
  baseURL: "https://x-clone-backend-kgyt.onrender.com",
  withCredentials: true, // VERY important if using cookies
});

export default api;
