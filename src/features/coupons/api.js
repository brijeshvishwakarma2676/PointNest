import apiClient from "../../api/client";
import urls from "../../constants/urls";

/**
 * Promotional Voucher / Coupons API Service
 */
export const couponsApi = {
  /**
   * Fetches the paginated registry of coupon protocols
   * @param {Object} params - { search_query, page, size }
   * @returns Promise resolving to the registry list
   */
  getCoupons: async (params = {}) => {
    return await apiClient.get(urls.coupons, { params });
  },

  /**
   * Authorizes and mints a new coupon voucher protocol
   * @param {Object} couponData - The voucher configuration payload
   * @returns Promise resolving to the minted coupon response
   */
  mintCoupon: async (couponData) => {
    return await apiClient.post(urls.coupons, couponData);
  },

  /**
   * Toggles the authorization status of a specific voucher (active/blocked)
   * @param {number|string} couponId - The unique protocol identifier
   * @returns Promise resolving to the updated status response
   */
  toggleCouponStatus: async (couponId) => {
    return await apiClient.patch(`${urls.coupons}/${couponId}/status`);
  },

  /**
   * Fetches detailed protocol profile and redemption ledger for a specific voucher
   * @param {number|string} id - The unique protocol identifier
   * @returns Promise resolving to the detailed voucher data
   */
  getCouponDetail: async (id) => {
    return await apiClient.get(`${urls.coupons}/${id}`);
  },

  /**
   * Validates a coupon token before redemption
   * @param {string} code - The voucher code
   */
  validateCoupon: async (code) => {
    return await apiClient.post(urls.coupons_validate, { code });
  },

  /**
   * Finalizes the voucher redemption protocol
   * @param {Object} data - { code, customer_phone, order_amount }
   */
  redeemCoupon: async (data) => {
    return await apiClient.post(urls.coupons_redeem, data);
  }
};
