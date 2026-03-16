import apiClient from "../../api/client";
import urls from "../../constants/urls";

export const authApi = {
  /**
   * Logs in a user
   * @param {Object} credentials - { email, password }
   * @returns Promise resolving to the API response
   */
  login: async (credentials) => {
    return await apiClient.post(urls.login, credentials);
  },

  /**
   * Registers a new user/shop owner
   * @param {Object} userData - { shop_name, owner_name, email, phone, password }
   * @returns Promise resolving to the API response
   */
  register: async (userData) => {
    return await apiClient.post(urls.register, userData);
  },

  getMe: async () => {
    return await apiClient.get(urls.get_me);
  },
  /**
   * Refreshes the access token using a refresh token
   * @param {string} refreshToken - The refresh token
   * @returns Promise resolving to the new tokens
   */
  refreshToken: async (refreshToken) => {
    return await apiClient.post(urls.refresh_token, {
      refresh_token: refreshToken,
    });
  },
};
