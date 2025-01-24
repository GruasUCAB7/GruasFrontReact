import axios from "axios";
import { getAuthToken } from "./tokenService";

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY_URL,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiInstance;
