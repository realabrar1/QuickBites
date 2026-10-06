namespace FoodDelivery.API.Models;

public class Review
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public int CustomerId { get; set; }
    public User? Customer { get; set; }
    public int RestaurantId { get; set; }
    public Restaurant? Restaurant { get; set; }
    public int Rating { get; set; } // 1 to 5
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
