import apiClient from "../../api/client";
import urls from "../../constants/urls";

export const redemptionsApi = {
  /**
   * Redeems loyalty points for a customer
   * @param {Object} payload - { phone, points_to_redeem }
   * @returns Promise resolving to the API response
   */
  redeemPoints: async (payload) => {
    return await apiClient.post(urls.points_redeem, payload);
  },
};
