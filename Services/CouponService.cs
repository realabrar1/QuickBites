using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class CouponService : ICouponService
{
    private readonly ApplicationDbContext _context;

    public CouponService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CouponDto>> GetActiveCouponsAsync()
    {
        var coupons = await _context.Coupons
            .Where(c => c.IsActive && c.EndDate >= DateTime.UtcNow)
            .ToListAsync();

        return coupons.Select(MapToDto).ToList();
    }

    public async Task<CouponDto?> ValidateCouponAsync(string code, decimal subtotal)
    {
        var coupon = await _context.Coupons
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == code.Trim().ToUpper() && c.IsActive);

        if (coupon == null ||
            coupon.StartDate > DateTime.UtcNow ||
            coupon.EndDate < DateTime.UtcNow ||
            subtotal < coupon.MinimumOrderAmount ||
            coupon.TimesUsed >= coupon.UsageLimit)
        {
            return null;
        }

        return MapToDto(coupon);
    }

    public async Task<CouponDto> CreateCouponAsync(CreateCouponDto dto)
    {
        var coupon = new Coupon
        {
            Code = dto.Code.Trim().ToUpper(),
            Description = dto.Description,
            DiscountType = dto.DiscountType,
            DiscountValue = dto.DiscountValue,
            MinimumOrderAmount = dto.MinimumOrderAmount,
            MaximumDiscount = dto.MaximumDiscount,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            UsageLimit = dto.UsageLimit,
            IsActive = true
        };

        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();
        return MapToDto(coupon);
    }

    public async Task<bool> ToggleCouponStatusAsync(int id)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return false;

        coupon.IsActive = !coupon.IsActive;
        await _context.SaveChangesAsync();
        return true;
    }

    private static CouponDto MapToDto(Coupon c)
    {
        return new CouponDto
        {
            Id = c.Id,
            Code = c.Code,
            Description = c.Description,
            DiscountType = c.DiscountType,
            DiscountValue = c.DiscountValue,
            MinimumOrderAmount = c.MinimumOrderAmount,
            MaximumDiscount = c.MaximumDiscount,
            StartDate = c.StartDate,
            EndDate = c.EndDate,
            IsActive = c.IsActive
        };
    }
}
