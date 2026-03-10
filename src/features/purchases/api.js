import apiClient from "../../api/client";
import urls from "../../constants/urls";

export const purchasesApi = {
  /**
   * Records a new purchase and awards loyalty points
   * @param {string} phone - Customer's phone number
   * @param {number} amount - Purchase amount
   * @returns Promise resolving to the purchase creation response
   */
  addPurchase: async (phone, amount) => {
    // As per requirement: purchases?phone=9999999999&amount=100
    return await apiClient.post(
      `${urls.purchases}?phone=${phone}&amount=${amount}`,
    );
  },
};
