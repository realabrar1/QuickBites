using System.Security.Claims;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("restaurant/{restaurantId}")]
    public async Task<IActionResult> GetRestaurantReviews(int restaurantId)
    {
        var reviews = await _reviewService.GetRestaurantReviewsAsync(restaurantId);
        return Ok(ApiResponse<List<ReviewDto>>.SuccessResponse(reviews));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        var userId = GetUserId();
        var review = await _reviewService.AddReviewAsync(userId, dto);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ReviewDto>.SuccessResponse(review, "Review submitted successfully."));
    }

    [Authorize(Roles = UserRoles.Admin)]
    [HttpPatch("{id}/moderate")]
    public async Task<IActionResult> ModerateReview(int id, [FromQuery] bool approve = true)
    {
        var updated = await _reviewService.ApproveOrModerateReviewAsync(id, approve);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Review not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Review status updated."));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }
}
