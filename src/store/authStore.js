import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../features/auth/api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Holds user profile data (shop_name, owner_name, etc.)
      token: null, // Holds JWT access_token
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login Action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const loginResponse = await authApi.login(credentials);

          if (loginResponse.success) {
            const { access_token } = loginResponse.data;

            // Save token to localStorage for the Axios interceptor immediately
            // so that subsequent requests (like getMe) can use it.
            localStorage.setItem("access_token", access_token);

            // Fetch User Profile Data
            try {
              const userResponse = await authApi.getMe();

              // Save complete user state (token and profile)
              set({
                token: access_token,
                user: userResponse.data || userResponse, // Handle based on actual api wrapper response
                isAuthenticated: true,
                isLoading: false,
              });

              return { success: true, message: loginResponse.message };
              // eslint-disable-next-line no-unused-vars
            } catch (error) {
              // If profile fetch fails, clean up the token since the login flow isn't complete
              localStorage.removeItem("access_token");
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
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Clear generic errors
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    },
  ),
);

export default useAuthStore;
