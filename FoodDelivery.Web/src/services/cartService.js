import { apiRequest } from './api';

export const cartService = {
  getCart: async () => {
    return await apiRequest('/cart', 'GET', null, true);
  },

  addItem: async (foodItemId, quantity = 1) => {
    return await apiRequest('/cart/items', 'POST', { foodItemId, quantity }, true);
  },

  updateQuantity: async (cartItemId, quantity) => {
    return await apiRequest(`/cart/items/${cartItemId}`, 'PUT', { quantity }, true);
  },

  removeItem: async (cartItemId) => {
    return await apiRequest(`/cart/items/${cartItemId}`, 'DELETE', null, true);
  },

  clearCart: async () => {
    return await apiRequest('/cart/clear', 'DELETE', null, true);
  }
};
