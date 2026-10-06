import { apiRequest } from './api';

export const reviewService = {
  getByRestaurant: async (restaurantId) => {
    return await apiRequest(`/reviews/restaurant/${restaurantId}`);
  },

  create: async (orderId, rating, comment) => {
    return await apiRequest('/reviews', 'POST', { orderId, rating, comment }, true);
  },

  moderate: async (id, approve = true) => {
    return await apiRequest(`/reviews/${id}/moderate?approve=${approve}`, 'PATCH', null, true);
  }
};
