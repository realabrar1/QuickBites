using System.Security.Claims;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[Authorize(Roles = UserRoles.DeliveryPartner + "," + UserRoles.Admin)]
[ApiController]
[Route("api/[controller]")]
public class DeliveryController : ControllerBase
{
    private readonly IOrderService _orderService;

    public DeliveryController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableDeliveries()
    {
        var deliveries = await _orderService.GetAvailableDeliveriesAsync();
        return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(deliveries));
    }

    [HttpGet("my-deliveries")]
    public async Task<IActionResult> GetMyDeliveries()
    {
        var userId = GetUserId();
        var deliveries = await _orderService.GetDeliveryPartnerOrdersAsync(userId);
        return Ok(ApiResponse<List<OrderDto>>.SuccessResponse(deliveries));
    }

    [HttpPost("orders/{orderId}/accept")]
    public async Task<IActionResult> AcceptDelivery(int orderId)
    {
        var userId = GetUserId();
        var accepted = await _orderService.AcceptDeliveryAsync(orderId, userId);
        if (!accepted)
            return BadRequest(ApiResponse<object>.FailureResponse("Order is already assigned or not available."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Delivery assigned successfully."));
    }

    [HttpPatch("orders/{orderId}/status")]
    [HttpPut("orders/{orderId}/status")]
    public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] UpdateOrderStatusDto dto)
    {
        var userId = GetUserId();
        var updated = await _orderService.UpdateOrderStatusAsync(orderId, dto.Status, userId, UserRoles.DeliveryPartner);
        if (!updated)
            return BadRequest(ApiResponse<object>.FailureResponse("Failed to update delivery status."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Delivery status updated successfully."));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }
}
