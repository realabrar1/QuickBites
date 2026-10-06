using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface ICartService
{
    Task<CartDto> GetCartAsync(int userId);
    Task<CartDto> AddToCartAsync(int userId, AddToCartDto dto);
    Task<CartDto> UpdateItemQuantityAsync(int userId, int cartItemId, int quantity);
    Task<CartDto> RemoveItemAsync(int userId, int cartItemId);
    Task<bool> ClearCartAsync(int userId);
}
