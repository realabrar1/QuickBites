using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface IFoodService
{
    Task<List<FoodItemDto>> GetRestaurantFoodItemsAsync(int restaurantId);
    Task<FoodItemDto?> GetFoodItemByIdAsync(int id);
    Task<FoodItemDto> CreateFoodItemAsync(CreateFoodItemDto dto);
    Task<bool> UpdateFoodItemAsync(int id, CreateFoodItemDto dto);
    Task<bool> ToggleAvailabilityAsync(int id);
    Task<bool> DeleteFoodItemAsync(int id);
    
    Task<FoodCategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
    Task<bool> UpdateCategoryAsync(int id, CreateCategoryDto dto);
    Task<bool> DeleteCategoryAsync(int id);
}
