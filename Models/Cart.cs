namespace FoodDelivery.API.Models;

public class Cart
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int? RestaurantId { get; set; }
    public Restaurant? Restaurant { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
