import axios from "axios";
import { API_BASE_URL } from "../utils/apiConstants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors here if needed in the future
// api.interceptors.request.use(...)
// api.interceptors.response.use(...)

export default api;
