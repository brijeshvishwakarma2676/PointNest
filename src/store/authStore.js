import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../features/auth/api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Holds user profile data (shop_name, owner_name, etc.)
      accessToken: null, // Holds JWT access_token
      refreshToken: null, // Holds JWT refresh_token
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login Action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const loginResponse = await authApi.login(credentials);

          if (loginResponse.success) {
            const { access_token, refresh_token } = loginResponse.data;

            // Save tokens to localStorage for persistent interceptor access
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            // Fetch User Profile Data
            try {
              const userResponse = await authApi.getMe();

              // Save complete user state (token and profile)
              set({
                accessToken: access_token,
                refreshToken: refresh_token,
                user: userResponse.data || userResponse, // Handle based on actual api wrapper response
                isAuthenticated: true,
                isLoading: false,
              });

              return { success: true, message: loginResponse.message };
              // eslint-disable-next-line no-unused-vars
            } catch (error) {
              // If profile fetch fails, clean up tokens
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              set({ isLoading: false, error: "Failed to fetch user profile" });
              return {
                success: false,
                message: "Failed to fetch user profile",
              };
            }
          } else {
            set({ isLoading: false, error: loginResponse.message });
            return { success: false, message: loginResponse.message };
          }
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Register Action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(userData);

          if (response.success) {
            // Depending on the API design, we might want to auto-login here
            // For now, we'll just save the user data and return success
            set({
              user: response.data,
              isLoading: false,
            });

            return { success: true, message: response.message };
          } else {
            set({ isLoading: false, error: response.message });
            return { success: false, message: response.message };
          }
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Logout Action
      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Fetch/Refresh User Profile Data
      refreshProfile: async (date_filter = "all") => {
        try {
          const userResponse = await authApi.getMe(date_filter);
          set({
            user: userResponse.data || userResponse,
          });
          return { success: true };
        } catch (error) {
          console.error("Failed to refresh profile:", error);
          return { success: false, message: error.message };
        }
      },

      // Clear generic errors
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    },
  ),
);

export default useAuthStore;
