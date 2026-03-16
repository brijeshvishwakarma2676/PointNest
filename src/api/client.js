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
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and it's not a retry already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          // No refresh token, force logout
          handleAuthFailure();
          return Promise.reject(error);
        }

        // Try to refresh the token
        // Note: Using axios directly instead of apiClient to avoid interceptor loop if refresh returns 401
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        if (response.data?.success) {
          const { access_token } = response.data.data;

          // Save new token
          localStorage.setItem("access_token", access_token);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, log user out
        handleAuthFailure();
        return Promise.reject(refreshError);
      }
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

// Helper to clear auth and potentially redirect
function handleAuthFailure() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // If we were using window.location.href = '/login', it would force a full reload.
  // Better to let the app state handle it if possible, but for a global interceptor,
  // sometimes a reload or direct redirect is safest to clear all state.
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
}

export default apiClient;
