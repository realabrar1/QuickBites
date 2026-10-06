using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class RestaurantService : IRestaurantService
{
    private readonly ApplicationDbContext _context;

    public RestaurantService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<RestaurantDto>> GetAllRestaurantsAsync(string? search, string? cuisine, string? sort)
    {
        var query = _context.Restaurants
            .Include(r => r.Categories)
                .ThenInclude(c => c.FoodItems)
            .Where(r => r.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(searchLower) ||
                                     r.CuisineType.ToLower().Contains(searchLower) ||
                                     r.Description.ToLower().Contains(searchLower) ||
                                     r.FoodItems.Any(f => f.Name.ToLower().Contains(searchLower)));
        }

        if (!string.IsNullOrWhiteSpace(cuisine))
        {
            var cuisineLower = cuisine.Trim().ToLower();
            query = query.Where(r => r.CuisineType.ToLower().Contains(cuisineLower));
        }

        query = sort?.ToLower() switch
        {
            "rating" => query.OrderByDescending(r => r.Rating),
            "deliveryfee" => query.OrderBy(r => r.DeliveryFee),
            "name" => query.OrderBy(r => r.Name),
            _ => query.OrderByDescending(r => r.Rating)
        };

        var restaurants = await query.ToListAsync();
        return restaurants.Select(MapToDto).ToList();
    }

    public async Task<RestaurantDto?> GetRestaurantByIdAsync(int id)
    {
        var restaurant = await _context.Restaurants
            .Include(r => r.Categories.OrderBy(c => c.DisplayOrder))
                .ThenInclude(c => c.FoodItems)
            .FirstOrDefaultAsync(r => r.Id == id);

        return restaurant == null ? null : MapToDto(restaurant);
    }

    public async Task<RestaurantDto> CreateRestaurantAsync(int ownerId, CreateRestaurantDto dto)
    {
        var restaurant = new Restaurant
        {
            Name = dto.Name,
            Description = dto.Description,
            LogoUrl = dto.LogoUrl,
            CoverImageUrl = dto.CoverImageUrl,
            CuisineType = dto.CuisineType,
            Address = dto.Address,
            Phone = dto.Phone,
            Email = dto.Email,
            OpeningTime = dto.OpeningTime,
            ClosingTime = dto.ClosingTime,
            DeliveryFee = dto.DeliveryFee,
            MinimumOrderAmount = dto.MinimumOrderAmount,
            OwnerId = ownerId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();

        return MapToDto(restaurant);
    }

    public async Task<bool> UpdateRestaurantAsync(int id, int ownerId, CreateRestaurantDto dto)
    {
        var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == id && (r.OwnerId == ownerId || ownerId == 0));
        if (restaurant == null) return false;

        restaurant.Name = dto.Name;
        restaurant.Description = dto.Description;
        restaurant.LogoUrl = dto.LogoUrl;
        restaurant.CoverImageUrl = dto.CoverImageUrl;
        restaurant.CuisineType = dto.CuisineType;
        restaurant.Address = dto.Address;
        restaurant.Phone = dto.Phone;
        restaurant.Email = dto.Email;
        restaurant.OpeningTime = dto.OpeningTime;
        restaurant.ClosingTime = dto.ClosingTime;
        restaurant.DeliveryFee = dto.DeliveryFee;
        restaurant.MinimumOrderAmount = dto.MinimumOrderAmount;
        restaurant.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleRestaurantStatusAsync(int id)
    {
        var restaurant = await _context.Restaurants.FindAsync(id);
        if (restaurant == null) return false;

        restaurant.IsActive = !restaurant.IsActive;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<RestaurantDto>> GetOwnerRestaurantsAsync(int ownerId)
    {
        var restaurants = await _context.Restaurants
            .Include(r => r.Categories)
                .ThenInclude(c => c.FoodItems)
            .Where(r => r.OwnerId == ownerId)
            .ToListAsync();

        return restaurants.Select(MapToDto).ToList();
    }

    private static RestaurantDto MapToDto(Restaurant r)
    {
        return new RestaurantDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            LogoUrl = r.LogoUrl,
            CoverImageUrl = r.CoverImageUrl,
            CuisineType = r.CuisineType,
            Address = r.Address,
            Phone = r.Phone,
            Email = r.Email,
            OpeningTime = r.OpeningTime,
            ClosingTime = r.ClosingTime,
            DeliveryFee = r.DeliveryFee,
            MinimumOrderAmount = r.MinimumOrderAmount,
            Rating = r.Rating,
            TotalRatings = r.TotalRatings,
            IsActive = r.IsActive,
            OwnerId = r.OwnerId,
            Categories = r.Categories.Select(c => new FoodCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                DisplayOrder = c.DisplayOrder,
                IsActive = c.IsActive,
                RestaurantId = c.RestaurantId,
                FoodItems = c.FoodItems.Select(f => new FoodItemDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description,
                    Price = f.Price,
                    DiscountPrice = f.DiscountPrice,
                    ImageUrl = f.ImageUrl,
                    IsVegetarian = f.IsVegetarian,
                    IsAvailable = f.IsAvailable,
                    PreparationTimeMinutes = f.PreparationTimeMinutes,
                    CategoryId = f.CategoryId,
                    RestaurantId = f.RestaurantId
                }).ToList()
            }).ToList()
        };
    }
}
