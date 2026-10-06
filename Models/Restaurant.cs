namespace FoodDelivery.API.Models;

public class Restaurant
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
    public string OpeningTime { get; set; } = "09:00 AM";
    public string ClosingTime { get; set; } = "11:00 PM";
    public decimal DeliveryFee { get; set; } = 40.00m;
    public decimal MinimumOrderAmount { get; set; } = 150.00m;
    public double Rating { get; set; } = 4.5;
    public int TotalRatings { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public int OwnerId { get; set; }
    public User? Owner { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<FoodCategory> Categories { get; set; } = new List<FoodCategory>();
    public ICollection<FoodItem> FoodItems { get; set; } = new List<FoodItem>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
