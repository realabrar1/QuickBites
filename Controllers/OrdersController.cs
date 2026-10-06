using System.Security.Claims;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("checkout")]
    [HttpPost]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequestDto dto)
    {
        var userId = GetUserId();
        var order = await _orderService.CheckoutAsync(userId, dto);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<OrderDto>.SuccessResponse(order, "Order placed successfully."));
    }

    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetUserId();
        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(orders));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var userId = GetUserId();
        var role = GetUserRole();
        var order = await _orderService.GetOrderByIdAsync(id, userId, role);

        if (order == null)
            return NotFound(ApiResponse<object>.FailureResponse("Order not found or unauthorized."));

        return Ok(ApiResponse<OrderDto>.SuccessResponse(order));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.Admin)]
    [HttpGet("restaurant-orders")]
    public async Task<IActionResult> GetRestaurantOrders([FromQuery] int? restaurantId)
    {
        var userId = GetUserId();
        var orders = await _orderService.GetRestaurantOrdersAsync(userId, restaurantId);
        return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(orders));
    }

    [Authorize(Roles = UserRoles.RestaurantOwner + "," + UserRoles.DeliveryPartner + "," + UserRoles.Admin)]
    [HttpPatch("{id}/status")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var userId = GetUserId();
        var role = GetUserRole();
        var updated = await _orderService.UpdateOrderStatusAsync(id, dto.Status, userId, role);

        if (!updated)
            return BadRequest(ApiResponse<object>.FailureResponse("Failed to update order status."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Order status updated successfully."));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }

    private string GetUserRole()
    {
        var claim = User.FindFirst(ClaimTypes.Role);
        return claim?.Value ?? UserRoles.Customer;
    }
}
