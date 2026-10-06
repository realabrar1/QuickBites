namespace FoodDelivery.API.DTOs;

public class CouponDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public decimal MinimumOrderAmount { get; set; }
    public decimal MaximumDiscount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DiscountType { get; set; } = "Percentage";
    public decimal DiscountValue { get; set; }
    public decimal MinimumOrderAmount { get; set; } = 0;
    public decimal MaximumDiscount { get; set; } = 0;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime EndDate { get; set; } = DateTime.UtcNow.AddMonths(1);
    public int UsageLimit { get; set; } = 100;
}

public class ApplyCouponDto
{
    public string Code { get; set; } = string.Empty;
    public decimal OrderSubtotal { get; set; }
}

public class ReviewDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int RestaurantId { get; set; }
    public string RestaurantName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    public int OrderId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}

public class AdminDashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalRestaurants { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TodayOrdersCount { get; set; }
    public decimal TodayRevenue { get; set; }
}

public class RestaurantDashboardStatsDto
{
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public int PendingOrdersCount { get; set; }
    public int TotalMenuItems { get; set; }
}
