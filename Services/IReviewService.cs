using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface IReviewService
{
    Task<List<ReviewDto>> GetRestaurantReviewsAsync(int restaurantId);
    Task<ReviewDto> AddReviewAsync(int customerId, CreateReviewDto dto);
    Task<bool> ApproveOrModerateReviewAsync(int reviewId, bool isApproved);
}
