namespace FoodDelivery.API.Models;

public class FoodCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public int RestaurantId { get; set; }
    public Restaurant? Restaurant { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<FoodItem> FoodItems { get; set; } = new List<FoodItem>();
}
