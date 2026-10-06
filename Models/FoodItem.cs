namespace FoodDelivery.API.Models;

public class FoodItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsVegetarian { get; set; } = true;
    public bool IsAvailable { get; set; } = true;
    public int PreparationTimeMinutes { get; set; } = 20;
    public int CategoryId { get; set; }
    public FoodCategory? Category { get; set; }
    public int RestaurantId { get; set; }
    public Restaurant? Restaurant { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
