using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FoodsController : ControllerBase
{
    private readonly IFoodService _foodService;

    public FoodsController(IFoodService foodService)
    {
        _foodService = foodService;
    }

    [HttpGet("restaurant/{restaurantId}")]
    public async Task<IActionResult> GetByRestaurant(int restaurantId)
    {
        var items = await _foodService.GetRestaurantFoodItemsAsync(restaurantId);
        return Ok(ApiResponse<List<FoodItemDto>>.SuccessResponse(items));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _foodService.GetFoodItemByIdAsync(id);
        if (item == null)
            return NotFound(ApiResponse<object>.FailureResponse("Food item not found."));

        return Ok(ApiResponse<FoodItemDto>.SuccessResponse(item));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFoodItemDto dto)
    {
        var item = await _foodService.CreateFoodItemAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, ApiResponse<FoodItemDto>.SuccessResponse(item, "Food item created successfully."));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateFoodItemDto dto)
    {
        var updated = await _foodService.UpdateFoodItemAsync(id, dto);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Food item not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Food item updated successfully."));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpPatch("{id}/toggle-availability")]
    public async Task<IActionResult> ToggleAvailability(int id)
    {
        var updated = await _foodService.ToggleAvailabilityAsync(id);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Food item not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Availability updated."));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _foodService.DeleteFoodItemAsync(id);
        if (!deleted)
            return NotFound(ApiResponse<object>.FailureResponse("Food item not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Food item deleted successfully."));
    }

    // Food Category APIs
    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        var category = await _foodService.CreateCategoryAsync(dto);
        return Ok(ApiResponse<FoodCategoryDto>.SuccessResponse(category, "Category created."));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto dto)
    {
        var updated = await _foodService.UpdateCategoryAsync(id, dto);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Category not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Category updated."));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var deleted = await _foodService.DeleteCategoryAsync(id);
        if (!deleted)
            return NotFound(ApiResponse<object>.FailureResponse("Category not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Category deleted."));
    }
}
