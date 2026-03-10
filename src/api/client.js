import axios from "axios";

// Create an Axios instance using the Vite environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle global errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    // Return just the data part of the response for easier handling
    return response.data;
  },
  (error) => {
    // If we get a 401, we might want to automatically log the user out
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      // Could also trigger a global Zustand action here to clear user state
    }

    // Format error message to be easily consumable by the UI
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(customError);
  },
);

export default apiClient;
