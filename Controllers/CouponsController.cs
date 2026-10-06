using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly ICouponService _couponService;

    public CouponsController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveCoupons()
    {
        var coupons = await _couponService.GetActiveCouponsAsync();
        return Ok(ApiResponse<List<CouponDto>>.SuccessResponse(coupons));
    }

    [HttpPost("validate")]
    public async Task<IActionResult> ValidateCoupon([FromBody] ApplyCouponDto dto)
    {
        var coupon = await _couponService.ValidateCouponAsync(dto.Code, dto.OrderSubtotal);
        if (coupon == null)
            return BadRequest(ApiResponse<object>.FailureResponse("Coupon is invalid, expired, or minimum subtotal not met."));

        return Ok(ApiResponse<CouponDto>.SuccessResponse(coupon, "Coupon applied successfully."));
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCouponDto dto)
    {
        var coupon = await _couponService.CreateCouponAsync(dto);
        return Ok(ApiResponse<CouponDto>.SuccessResponse(coupon, "Coupon created successfully."));
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpPatch("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var updated = await _couponService.ToggleCouponStatusAsync(id);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Coupon not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Coupon status updated."));
    }
}
