using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class CartService : ICartService
{
    private readonly ApplicationDbContext _context;

    public CartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto> GetCartAsync(int userId)
    {
        var cart = await GetOrCreateCartEntityAsync(userId);
        return MapToDto(cart);
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto dto)
    {
        var foodItem = await _context.FoodItems
            .Include(f => f.Restaurant)
            .FirstOrDefaultAsync(f => f.Id == dto.FoodItemId);

        if (foodItem == null || !foodItem.IsAvailable)
        {
            throw new Exception("Selected food item is not available.");
        }

        var cart = await GetOrCreateCartEntityAsync(userId);

        // If cart has items from another restaurant, reset cart for the new restaurant
        if (cart.RestaurantId.HasValue && cart.RestaurantId != foodItem.RestaurantId)
        {
            _context.CartItems.RemoveRange(cart.Items);
            cart.Items.Clear();
            cart.RestaurantId = foodItem.RestaurantId;
        }
        else if (!cart.RestaurantId.HasValue)
        {
            cart.RestaurantId = foodItem.RestaurantId;
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.FoodItemId == dto.FoodItemId);
        var unitPrice = foodItem.DiscountPrice ?? foodItem.Price;

        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
            existingItem.UnitPrice = unitPrice;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                CartId = cart.Id,
                FoodItemId = dto.FoodItemId,
                Quantity = dto.Quantity,
                UnitPrice = unitPrice
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<CartDto> UpdateItemQuantityAsync(int userId, int cartItemId, int quantity)
    {
        var cart = await GetOrCreateCartEntityAsync(userId);
        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);

        if (item != null)
        {
            if (quantity <= 0)
            {
                _context.CartItems.Remove(item);
                cart.Items.Remove(item);
            }
            else
            {
                item.Quantity = quantity;
            }

            if (!cart.Items.Any())
            {
                cart.RestaurantId = null;
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return await GetCartAsync(userId);
    }

    public async Task<CartDto> RemoveItemAsync(int userId, int cartItemId)
    {
        return await UpdateItemQuantityAsync(userId, cartItemId, 0);
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null) return false;

        _context.CartItems.RemoveRange(cart.Items);
        cart.Items.Clear();
        cart.RestaurantId = null;
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    private async Task<Cart> GetOrCreateCartEntityAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Restaurant)
            .Include(c => c.Items)
                .ThenInclude(i => i.FoodItem)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    private static CartDto MapToDto(Cart cart)
    {
        var items = cart.Items.Select(i => new CartItemDto
        {
            Id = i.Id,
            FoodItemId = i.FoodItemId,
            FoodName = i.FoodItem?.Name ?? "Food Item",
            ImageUrl = i.FoodItem?.ImageUrl ?? "",
            UnitPrice = i.UnitPrice,
            Quantity = i.Quantity,
            TotalPrice = i.UnitPrice * i.Quantity
        }).ToList();

        var subtotal = items.Sum(i => i.TotalPrice);
        var deliveryFee = cart.Restaurant?.DeliveryFee ?? 40.00m;

        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            RestaurantId = cart.RestaurantId,
            RestaurantName = cart.Restaurant?.Name,
            DeliveryFee = cart.RestaurantId.HasValue && items.Any() ? deliveryFee : 0m,
            Items = items,
            Subtotal = subtotal,
            GrandTotal = cart.RestaurantId.HasValue && items.Any() ? subtotal + deliveryFee : 0m
        };
    }
}
