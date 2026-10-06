import { apiRequest } from './api';

export const foodService = {
  getByRestaurant: async (restaurantId) => {
    return await apiRequest(`/foods/restaurant/${restaurantId}`);
  },

  create: async (data) => {
    return await apiRequest('/foods', 'POST', data, true);
  },

  update: async (id, data) => {
    return await apiRequest(`/foods/${id}`, 'PUT', data, true);
  },

  toggleAvailability: async (id) => {
    return await apiRequest(`/foods/${id}/toggle-availability`, 'PATCH', null, true);
  },

  delete: async (id) => {
    return await apiRequest(`/foods/${id}`, 'DELETE', null, true);
  },

  createCategory: async (data) => {
    return await apiRequest('/foods/categories', 'POST', data, true);
  }
};
