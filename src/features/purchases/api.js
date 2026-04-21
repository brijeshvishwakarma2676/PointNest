import apiClient from "../../api/client";
import urls from "../../constants/urls";

export const purchasesApi = {
  /**
   * Records a new purchase and awards loyalty points
   * @param {string} phone - Customer's phone number
   * @param {number} amount - Purchase amount
   * @returns Promise resolving to the purchase creation response
   */
  addPurchase: async (data) => {
    return await apiClient.post(urls.purchases, data);
  },

  /**
   * Fetches the recent purchases for the shop
   * @param {Object} params - page and size
   */
  getPurchases: async (params = { page: 1, size: 10 }) => {
    return await apiClient.get(urls.purchases, { params });
  },
};
