using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class FoodService : IFoodService
{
    private readonly ApplicationDbContext _context;

    public FoodService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<FoodItemDto>> GetRestaurantFoodItemsAsync(int restaurantId)
    {
        var items = await _context.FoodItems
            .Where(f => f.RestaurantId == restaurantId)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<FoodItemDto?> GetFoodItemByIdAsync(int id)
    {
        var item = await _context.FoodItems.FindAsync(id);
        return item == null ? null : MapToDto(item);
    }

    public async Task<FoodItemDto> CreateFoodItemAsync(CreateFoodItemDto dto)
    {
        var item = new FoodItem
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            ImageUrl = dto.ImageUrl,
            IsVegetarian = dto.IsVegetarian,
            IsAvailable = dto.IsAvailable,
            PreparationTimeMinutes = dto.PreparationTimeMinutes,
            CategoryId = dto.CategoryId,
            RestaurantId = dto.RestaurantId,
            CreatedAt = DateTime.UtcNow
        };

        _context.FoodItems.Add(item);
        await _context.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<bool> UpdateFoodItemAsync(int id, CreateFoodItemDto dto)
    {
        var item = await _context.FoodItems.FindAsync(id);
        if (item == null) return false;

        item.Name = dto.Name;
        item.Description = dto.Description;
        item.Price = dto.Price;
        item.DiscountPrice = dto.DiscountPrice;
        item.ImageUrl = dto.ImageUrl;
        item.IsVegetarian = dto.IsVegetarian;
        item.IsAvailable = dto.IsAvailable;
        item.PreparationTimeMinutes = dto.PreparationTimeMinutes;
        item.CategoryId = dto.CategoryId;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleAvailabilityAsync(int id)
    {
        var item = await _context.FoodItems.FindAsync(id);
        if (item == null) return false;

        item.IsAvailable = !item.IsAvailable;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteFoodItemAsync(int id)
    {
        var item = await _context.FoodItems.FindAsync(id);
        if (item == null) return false;

        _context.FoodItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<FoodCategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var category = new FoodCategory
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            DisplayOrder = dto.DisplayOrder,
            RestaurantId = dto.RestaurantId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.FoodCategories.Add(category);
        await _context.SaveChangesAsync();

        return new FoodCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            DisplayOrder = category.DisplayOrder,
            IsActive = category.IsActive,
            RestaurantId = category.RestaurantId
        };
    }

    public async Task<bool> UpdateCategoryAsync(int id, CreateCategoryDto dto)
    {
        var category = await _context.FoodCategories.FindAsync(id);
        if (category == null) return false;

        category.Name = dto.Name;
        category.Description = dto.Description;
        category.ImageUrl = dto.ImageUrl;
        category.DisplayOrder = dto.DisplayOrder;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _context.FoodCategories.FindAsync(id);
        if (category == null) return false;

        _context.FoodCategories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }

    private static FoodItemDto MapToDto(FoodItem f)
    {
        return new FoodItemDto
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
        };
    }
}
