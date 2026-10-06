import { apiRequest } from './api';

export const restaurantService = {
  getAll: async (search = '', cuisine = '', sort = 'rating') => {
    let query = '?';
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (cuisine) query += `cuisine=${encodeURIComponent(cuisine)}&`;
    if (sort) query += `sort=${encodeURIComponent(sort)}`;
    
    return await apiRequest(`/restaurants${query}`);
  },

  getById: async (id) => {
    return await apiRequest(`/restaurants/${id}`);
  },

  getOwnerRestaurants: async () => {
    return await apiRequest('/restaurants/owner/my-restaurants', 'GET', null, true);
  },

  create: async (data) => {
    return await apiRequest('/restaurants', 'POST', data, true);
  },

  update: async (id, data) => {
    return await apiRequest(`/restaurants/${id}`, 'PUT', data, true);
  },

  toggleStatus: async (id) => {
    return await apiRequest(`/restaurants/${id}/toggle-status`, 'PATCH', null, true);
  }
};
