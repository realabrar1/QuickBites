using FoodDelivery.API.Models;

namespace FoodDelivery.API.Services;

public interface IJwtService
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user);
}
