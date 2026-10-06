using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface IOrderService
{
    Task<OrderDto> CheckoutAsync(int userId, CheckoutRequestDto dto);
    Task<OrderDto?> GetOrderByIdAsync(int orderId, int userId, string userRole);
    Task<List<OrderDto>> GetUserOrdersAsync(int userId);
    Task<List<OrderDto>> GetRestaurantOrdersAsync(int ownerId, int? restaurantId);
    Task<bool> UpdateOrderStatusAsync(int orderId, string status, int userId, string userRole);
    Task<List<OrderDto>> GetAvailableDeliveriesAsync();
    Task<List<OrderDto>> GetDeliveryPartnerOrdersAsync(int deliveryPartnerId);
    Task<bool> AcceptDeliveryAsync(int orderId, int deliveryPartnerId);
}
