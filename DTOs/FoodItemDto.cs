namespace FoodDelivery.API.DTOs;

public class FoodItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsVegetarian { get; set; }
    public bool IsAvailable { get; set; }
    public int PreparationTimeMinutes { get; set; }
    public int CategoryId { get; set; }
    public int RestaurantId { get; set; }
}

public class CreateFoodItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsVegetarian { get; set; } = true;
    public bool IsAvailable { get; set; } = true;
    public int PreparationTimeMinutes { get; set; } = 20;
    public int CategoryId { get; set; }
    public int RestaurantId { get; set; }
}
