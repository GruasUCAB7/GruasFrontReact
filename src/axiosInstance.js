import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
