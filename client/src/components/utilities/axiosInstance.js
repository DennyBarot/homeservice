import axios from "axios";
const DB_URL = import.meta.env.VITE_DB_URL;

console.log("VITE_DB_URL:", DB_URL);

export const axiosInstance = axios.create({
  baseURL: DB_URL,
  withCredentials: true,
  // Removed default Content-Type header to allow multipart/form-data requests to set it automatically
});

// Removed Authorization header to avoid duplicating token in headers and cookies
// axiosInstance.interceptors.request.use((config) => {
//   const token = getTokenFromCookie();
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });
