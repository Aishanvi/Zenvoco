import axios from "axios";

const DEFAULT_URL = import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://zenvoco.onrender.com";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;