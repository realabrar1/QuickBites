using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class ReviewService : IReviewService
{
    private readonly ApplicationDbContext _context;

    public ReviewService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewDto>> GetRestaurantReviewsAsync(int restaurantId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Customer)
            .Include(r => r.Restaurant)
            .Where(r => r.RestaurantId == restaurantId && r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reviews.Select(MapToDto).ToList();
    }

    public async Task<ReviewDto> AddReviewAsync(int customerId, CreateReviewDto dto)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == dto.OrderId && o.CustomerId == customerId);

        if (order == null || order.OrderStatus != OrderStatuses.Delivered)
        {
            throw new Exception("You can only review completed orders.");
        }

        var review = new Review
        {
            OrderId = dto.OrderId,
            CustomerId = customerId,
            RestaurantId = order.RestaurantId,
            Rating = Math.Clamp(dto.Rating, 1, 5),
            Comment = dto.Comment,
            IsApproved = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);

        // Recalculate restaurant rating
        var restaurant = await _context.Restaurants.FindAsync(order.RestaurantId);
        if (restaurant != null)
        {
            var existingReviews = await _context.Reviews
                .Where(r => r.RestaurantId == restaurant.Id && r.IsApproved)
                .ToListAsync();

            var totalCount = existingReviews.Count + 1;
            var avgRating = (existingReviews.Sum(r => r.Rating) + review.Rating) / (double)totalCount;

            restaurant.Rating = Math.Round(avgRating, 1);
            restaurant.TotalRatings = totalCount;
        }

        await _context.SaveChangesAsync();
        return MapToDto(review);
    }

    public async Task<bool> ApproveOrModerateReviewAsync(int reviewId, bool isApproved)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null) return false;

        review.IsApproved = isApproved;
        await _context.SaveChangesAsync();
        return true;
    }

    private static ReviewDto MapToDto(Review r)
    {
        return new ReviewDto
        {
            Id = r.Id,
            OrderId = r.OrderId,
            CustomerId = r.CustomerId,
            CustomerName = r.Customer?.FullName ?? "Customer",
            RestaurantId = r.RestaurantId,
            RestaurantName = r.Restaurant?.Name ?? "Restaurant",
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        };
    }
}
