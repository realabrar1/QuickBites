import { apiRequest } from './api';

export const orderService = {
  checkout: async (checkoutData) => {
    return await apiRequest('/orders/checkout', 'POST', checkoutData, true);
  },

  getMyOrders: async () => {
    return await apiRequest('/orders/my-orders', 'GET', null, true);
  },

  getById: async (id) => {
    return await apiRequest(`/orders/${id}`, 'GET', null, true);
  },

  getRestaurantOrders: async (restaurantId = null) => {
    const url = restaurantId ? `/orders/restaurant-orders?restaurantId=${restaurantId}` : '/orders/restaurant-orders';
    return await apiRequest(url, 'GET', null, true);
  },

  updateStatus: async (orderId, status) => {
    return await apiRequest(`/orders/${orderId}/status`, 'PATCH', { status }, true);
  },

  getAvailableDeliveries: async () => {
    return await apiRequest('/delivery/available', 'GET', null, true);
  },

  getMyDeliveries: async () => {
    return await apiRequest('/delivery/my-deliveries', 'GET', null, true);
  },

  acceptDelivery: async (orderId) => {
    return await apiRequest(`/delivery/orders/${orderId}/accept`, 'POST', null, true);
  }
};
