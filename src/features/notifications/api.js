import apiClient from "../../api/client";

const BASE = "/notifications";

/**
 * Notification API Service
 * Connects Layout shell to the persistent backend notification ledger.
 */
export const notificationsApi = {
  /**
   * Fetches the most recent notifications for the current merchant.
   * @param {number} limit - Max number of alerts to fetch (default 20)
   */
  getAll: async (limit = 20) => {
    return await apiClient.get(BASE, { params: { limit } });
  },

  /**
   * Marks a single notification as read.
   * @param {number} id - Notification ID
   */
  markRead: async (id) => {
    return await apiClient.patch(`${BASE}/${id}/read`);
  },

  /**
   * Marks ALL notifications as read. Called when the dropdown is opened.
   */
  markAllRead: async () => {
    return await apiClient.patch(`${BASE}/read-all`);
  },

  /**
   * Deletes all notification records for the current merchant.
   * Triggered by the "Clear All" button.
   */
  clearAll: async () => {
    return await apiClient.delete(`${BASE}/clear-all`);
  },
};
