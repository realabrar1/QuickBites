using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdminDashboardStatsDto> GetAdminStatsAsync()
    {
        var today = DateTime.UtcNow.Date;

        var totalUsers = await _context.Users.CountAsync();
        var totalRestaurants = await _context.Restaurants.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders.Where(o => o.OrderStatus != OrderStatuses.Cancelled).SumAsync(o => (decimal?)o.GrandTotal) ?? 0m;

        var todayOrders = await _context.Orders.Where(o => o.CreatedAt >= today).CountAsync();
        var todayRevenue = await _context.Orders.Where(o => o.CreatedAt >= today && o.OrderStatus != OrderStatuses.Cancelled).SumAsync(o => (decimal?)o.GrandTotal) ?? 0m;

        return new AdminDashboardStatsDto
        {
            TotalUsers = totalUsers,
            TotalRestaurants = totalRestaurants,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            TodayOrdersCount = todayOrders,
            TodayRevenue = todayRevenue
        };
    }

    public async Task<RestaurantDashboardStatsDto> GetRestaurantStatsAsync(int ownerId)
    {
        var restaurantIds = await _context.Restaurants
            .Where(r => r.OwnerId == ownerId || ownerId == 0)
            .Select(r => r.Id)
            .ToListAsync();

        var totalOrders = await _context.Orders
            .Where(o => restaurantIds.Contains(o.RestaurantId))
            .CountAsync();

        var totalRevenue = await _context.Orders
            .Where(o => restaurantIds.Contains(o.RestaurantId) && o.OrderStatus != OrderStatuses.Cancelled)
            .SumAsync(o => (decimal?)o.GrandTotal) ?? 0m;

        var pendingOrders = await _context.Orders
            .Where(o => restaurantIds.Contains(o.RestaurantId) && (o.OrderStatus == OrderStatuses.Placed || o.OrderStatus == OrderStatuses.Confirmed || o.OrderStatus == OrderStatuses.Preparing))
            .CountAsync();

        var totalMenuItems = await _context.FoodItems
            .Where(f => restaurantIds.Contains(f.RestaurantId))
            .CountAsync();

        return new RestaurantDashboardStatsDto
        {
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            PendingOrdersCount = pendingOrders,
            TotalMenuItems = totalMenuItems
        };
    }

    public async Task<List<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _context.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
        return users.Select(u => new UserResponseDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            PhoneNumber = u.PhoneNumber,
            Role = u.Role,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        }).ToList();
    }

    public async Task<bool> ToggleUserActiveStatusAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync();
        return true;
    }
}
