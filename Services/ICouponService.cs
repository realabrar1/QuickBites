using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface ICouponService
{
    Task<List<CouponDto>> GetActiveCouponsAsync();
    Task<CouponDto?> ValidateCouponAsync(string code, decimal subtotal);
    Task<CouponDto> CreateCouponAsync(CreateCouponDto dto);
    Task<bool> ToggleCouponStatusAsync(int id);
}
