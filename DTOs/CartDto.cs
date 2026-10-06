namespace FoodDelivery.API.DTOs;

public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? RestaurantId { get; set; }
    public string? RestaurantName { get; set; }
    public decimal DeliveryFee { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal GrandTotal { get; set; }
}

public class CartItemDto
{
    public int Id { get; set; }
    public int FoodItemId { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

public class AddToCartDto
{
    public int FoodItemId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class UpdateCartItemDto
{
    public int Quantity { get; set; }
}
