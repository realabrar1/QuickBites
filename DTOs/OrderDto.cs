namespace FoodDelivery.API.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public int RestaurantId { get; set; }
    public string RestaurantName { get; set; } = string.Empty;
    public int? DeliveryPartnerId { get; set; }
    public string? DeliveryPartnerName { get; set; }
    public AddressDto Address { get; set; } = null!;
    public decimal Subtotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal GrandTotal { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string OrderStatus { get; set; } = string.Empty;
    public string? SpecialInstructions { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int Id { get; set; }
    public int FoodItemId { get; set; }
    public string FoodName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CheckoutRequestDto
{
    public int AddressId { get; set; }
    public string PaymentMethod { get; set; } = "COD";
    public string? CouponCode { get; set; }
    public string? SpecialInstructions { get; set; }
}

public class UpdateOrderStatusDto
{
    public string Status { get; set; } = string.Empty;
}
