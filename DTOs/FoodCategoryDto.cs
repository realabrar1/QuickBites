namespace FoodDelivery.API.DTOs;

public class FoodCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int RestaurantId { get; set; }
    public List<FoodItemDto> FoodItems { get; set; } = new();
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public int RestaurantId { get; set; }
}
