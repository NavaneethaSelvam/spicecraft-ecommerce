
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const adminToken = sessionStorage.getItem("adminToken");
    const customerToken = localStorage.getItem("token");
    const token = adminToken || customerToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      // Let the browser set multipart/form-data boundary.
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    } else if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof URLSearchParams)
    ) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed. Please log in again.");
    }

    if (error.response?.status === 403) {
      console.error("Access denied. Admin permission may be required.");
    }

    return Promise.reject(error);
  }
);

export default api;
