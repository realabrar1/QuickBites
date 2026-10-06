import { apiRequest } from './api';

export const addressService = {
  getAll: async () => {
    return await apiRequest('/addresses', 'GET', null, true);
  },

  create: async (data) => {
    return await apiRequest('/addresses', 'POST', data, true);
  },

  update: async (id, data) => {
    return await apiRequest(`/addresses/${id}`, 'PUT', data, true);
  },

  delete: async (id) => {
    return await apiRequest(`/addresses/${id}`, 'DELETE', null, true);
  }
};
