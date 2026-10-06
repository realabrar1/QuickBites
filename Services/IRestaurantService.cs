using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface IRestaurantService
{
    Task<List<RestaurantDto>> GetAllRestaurantsAsync(string? search, string? cuisine, string? sort);
    Task<RestaurantDto?> GetRestaurantByIdAsync(int id);
    Task<RestaurantDto> CreateRestaurantAsync(int ownerId, CreateRestaurantDto dto);
    Task<bool> UpdateRestaurantAsync(int id, int ownerId, CreateRestaurantDto dto);
    Task<bool> ToggleRestaurantStatusAsync(int id);
    Task<List<RestaurantDto>> GetOwnerRestaurantsAsync(int ownerId);
}
