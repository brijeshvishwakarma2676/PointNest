import apiClient from "../../api/client";
import urls from "../../constants/urls";

export const customersApi = {
  /**
   * Fetches a paginated list of customers
   * @param {Object} params - Query params like { page: 1, size: 10 }
   * @returns Promise resolving to the customers list response
   */
  getCustomers: async (params = {}) => {
    return await apiClient.post(urls.customers_list, params);
  },

  /**
   * Creates a new customer
   * @param {Object} customerData - { name, phone }
   * @returns Promise resolving to the creation response
   */
  addCustomer: async (customerData) => {
    return await apiClient.post(urls.customers, customerData);
  },

  /**
   * Fetches details of a specific customer
   * @param {Object} payload - { phone } or { id }
   * @returns Promise resolving to customer details
   */
  getCustomerDetails: async (payload) => {
    return await apiClient.get(urls.get_details, { params: payload });
  },
};
