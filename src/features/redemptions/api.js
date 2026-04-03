import apiClient from "../../api/client";
import urls from "../../constants/urls";

export const redemptionsApi = {
  /**
   * Fetches a paginated list of redemptions for the shop
   * @param {Object} params - { page, size }
   * @returns Promise resolving to the redemptions list response
   */
  getRedemptions: async (params = {}) => {
    return await apiClient.get(urls.redemptions_list, { params });
  },

  /**
   * Redeems points for a customer
   * @param {Object} data - { phone, points_to_redeem }
   * @returns Promise resolving to the redemption response
   */
  redeemPoints: async (data) => {
    return await apiClient.post(urls.points_redeem, data);
  },
};
