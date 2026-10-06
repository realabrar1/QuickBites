import { apiRequest } from './api';

export const adminService = {
  getAdminStats: async () => {
    return await apiRequest('/admin/stats', 'GET', null, true);
  },

  getRestaurantStats: async () => {
    return await apiRequest('/admin/restaurant-stats', 'GET', null, true);
  },

  getAllUsers: async () => {
    return await apiRequest('/admin/users', 'GET', null, true);
  },

  toggleUserActive: async (userId) => {
    return await apiRequest(`/admin/users/${userId}/toggle-active`, 'PATCH', null, true);
  }
};
