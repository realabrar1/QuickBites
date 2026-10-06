using System.Security.Claims;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var cart = await _cartService.GetCartAsync(userId);
        return Ok(ApiResponse<CartDto>.SuccessResponse(cart));
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        var userId = GetUserId();
        var cart = await _cartService.AddToCartAsync(userId, dto);
        return Ok(ApiResponse<CartDto>.SuccessResponse(cart, "Item added to cart."));
    }

    [HttpPut("items/{cartItemId}")]
    public async Task<IActionResult> UpdateItem(int cartItemId, [FromBody] UpdateCartItemDto dto)
    {
        var userId = GetUserId();
        var cart = await _cartService.UpdateItemQuantityAsync(userId, cartItemId, dto.Quantity);
        return Ok(ApiResponse<CartDto>.SuccessResponse(cart, "Cart item updated."));
    }

    [HttpDelete("items/{cartItemId}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
        var userId = GetUserId();
        var cart = await _cartService.RemoveItemAsync(userId, cartItemId);
        return Ok(ApiResponse<CartDto>.SuccessResponse(cart, "Item removed from cart."));
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        await _cartService.ClearCartAsync(userId);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Cart cleared successfully."));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }
}
