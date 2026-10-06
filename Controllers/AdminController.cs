using System.Security.Claims;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpGet("stats")]
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetAdminStats()
    {
        var stats = await _adminService.GetAdminStatsAsync();
        return Ok(ApiResponse<AdminDashboardStatsDto>.SuccessResponse(stats));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpGet("restaurant-stats")]
    public async Task<IActionResult> GetRestaurantStats()
    {
        var userId = GetUserId();
        var stats = await _adminService.GetRestaurantStatsAsync(userId);
        return Ok(ApiResponse<RestaurantDashboardStatsDto>.SuccessResponse(stats));
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(ApiResponse<List<UserResponseDto>>.SuccessResponse(users));
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpPatch("users/{userId}/toggle-active")]
    public async Task<IActionResult> ToggleUserActive(int userId)
    {
        var updated = await _adminService.ToggleUserActiveStatusAsync(userId);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("User not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "User status updated."));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }
}
