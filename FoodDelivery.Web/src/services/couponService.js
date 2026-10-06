import { apiRequest } from './api';

export const couponService = {
  getActive: async () => {
    return await apiRequest('/coupons');
  },

  validate: async (code, orderSubtotal) => {
    return await apiRequest('/coupons/validate', 'POST', { code, orderSubtotal });
  },

  create: async (data) => {
    return await apiRequest('/coupons', 'POST', data, true);
  },

  toggleStatus: async (id) => {
    return await apiRequest(`/coupons/${id}/toggle-status`, 'PATCH', null, true);
  }
};
