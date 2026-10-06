namespace FoodDelivery.API.Models;

public class Coupon
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DiscountType { get; set; } = "Percentage"; // "Percentage" or "Fixed"
    public decimal DiscountValue { get; set; }
    public decimal MinimumOrderAmount { get; set; } = 0;
    public decimal MaximumDiscount { get; set; } = 0;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime EndDate { get; set; } = DateTime.UtcNow.AddMonths(1);
    public int UsageLimit { get; set; } = 100;
    public int TimesUsed { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
