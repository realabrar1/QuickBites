using System.Security.Claims;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;

    public RestaurantsController(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? cuisine, [FromQuery] string? sort)
    {
        var restaurants = await _restaurantService.GetAllRestaurantsAsync(search, cuisine, sort);
        return Ok(ApiResponse<List<RestaurantDto>>.SuccessResponse(restaurants));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var restaurant = await _restaurantService.GetRestaurantByIdAsync(id);
        if (restaurant == null)
            return NotFound(ApiResponse<object>.FailureResponse("Restaurant not found."));

        return Ok(ApiResponse<RestaurantDto>.SuccessResponse(restaurant));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpGet("owner/my-restaurants")]
    public async Task<IActionResult> GetOwnerRestaurants()
    {
        var userId = GetUserId();
        var restaurants = await _restaurantService.GetOwnerRestaurantsAsync(userId);
        return Ok(ApiResponse<List<RestaurantDto>>.SuccessResponse(restaurants));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRestaurantDto dto)
    {
        var userId = GetUserId();
        var restaurant = await _restaurantService.CreateRestaurantAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = restaurant.Id }, ApiResponse<RestaurantDto>.SuccessResponse(restaurant, "Restaurant created successfully."));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateRestaurantDto dto)
    {
        var userId = GetUserId();
        var updated = await _restaurantService.UpdateRestaurantAsync(id, userId, dto);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Restaurant not found or unauthorized."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Restaurant updated successfully."));
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpPatch("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var updated = await _restaurantService.ToggleRestaurantStatusAsync(id);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Restaurant not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Restaurant status updated."));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }
}
