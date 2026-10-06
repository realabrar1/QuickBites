namespace FoodDelivery.API.DTOs;

public class RestaurantDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string CuisineType { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string OpeningTime { get; set; } = string.Empty;
    public string ClosingTime { get; set; } = string.Empty;
    public decimal DeliveryFee { get; set; }
    public decimal MinimumOrderAmount { get; set; }
    public double Rating { get; set; }
    public int TotalRatings { get; set; }
    public bool IsActive { get; set; }
    public int OwnerId { get; set; }
    public List<FoodCategoryDto> Categories { get; set; } = new();
}

public class CreateRestaurantDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public string CoverImageUrl { get; set; } = string.Empty;
    public string CuisineType { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string OpeningTime { get; set; } = "09:00 AM";
    public string ClosingTime { get; set; } = "11:00 PM";
    public decimal DeliveryFee { get; set; } = 40.00m;
    public decimal MinimumOrderAmount { get; set; } = 150.00m;
}
