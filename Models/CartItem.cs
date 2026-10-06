namespace FoodDelivery.API.Models;

public class CartItem
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public Cart? Cart { get; set; }
    public int FoodItemId { get; set; }
    public FoodItem? FoodItem { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
}
