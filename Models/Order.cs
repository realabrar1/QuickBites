namespace FoodDelivery.API.Models;

public static class OrderStatuses
{
    public const string Placed = "PLACED";
    public const string Confirmed = "CONFIRMED";
    public const string Preparing = "PREPARING";
    public const string Ready = "READY";
    public const string OutForDelivery = "OUT_FOR_DELIVERY";
    public const string Delivered = "DELIVERED";
    public const string Cancelled = "CANCELLED";
}

public static class PaymentMethods
{
    public const string COD = "COD";
    public const string Online = "Online";
}

public static class PaymentStatuses
{
    public const string Pending = "PENDING";
    public const string Paid = "PAID";
    public const string Failed = "FAILED";
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public User? Customer { get; set; }
    public int RestaurantId { get; set; }
    public Restaurant? Restaurant { get; set; }
    public int? DeliveryPartnerId { get; set; }
    public User? DeliveryPartner { get; set; }
    public int AddressId { get; set; }
    public Address? Address { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal GrandTotal { get; set; }
    public string PaymentMethod { get; set; } = PaymentMethods.COD;
    public string PaymentStatus { get; set; } = PaymentStatuses.Pending;
    public string OrderStatus { get; set; } = OrderStatuses.Placed;
    public string? SpecialInstructions { get; set; }
    public int? CouponId { get; set; }
    public Coupon? Coupon { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
