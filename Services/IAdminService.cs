using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface IAdminService
{
    Task<AdminDashboardStatsDto> GetAdminStatsAsync();
    Task<RestaurantDashboardStatsDto> GetRestaurantStatsAsync(int ownerId);
    Task<List<UserResponseDto>> GetAllUsersAsync();
    Task<bool> ToggleUserActiveStatusAsync(int userId);
}
