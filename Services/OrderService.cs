using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto> CheckoutAsync(int userId, CheckoutRequestDto dto)
    {
        // 1. Fetch user's cart
        var cart = await _context.Carts
            .Include(c => c.Restaurant)
            .Include(c => c.Items)
                .ThenInclude(i => i.FoodItem)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.Items.Any() || !cart.RestaurantId.HasValue)
        {
            throw new Exception("Your cart is empty.");
        }

        // 2. Fetch selected address
        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == dto.AddressId && a.UserId == userId);
        if (address == null)
        {
            throw new Exception("Selected delivery address is invalid.");
        }

        // 3. Server recalculates subtotal strictly from DB prices
        decimal subtotal = 0m;
        var orderItems = new List<OrderItem>();

        foreach (var cartItem in cart.Items)
        {
            var foodItem = cartItem.FoodItem;
            if (foodItem == null || !foodItem.IsAvailable)
            {
                throw new Exception($"Item '{foodItem?.Name ?? "Food Item"}' is no longer available.");
            }

            var unitPrice = foodItem.DiscountPrice ?? foodItem.Price;
            var itemTotal = unitPrice * cartItem.Quantity;
            subtotal += itemTotal;

            orderItems.Add(new OrderItem
            {
                FoodItemId = foodItem.Id,
                FoodName = foodItem.Name,
                UnitPrice = unitPrice,
                Quantity = cartItem.Quantity,
                TotalPrice = itemTotal
            });
        }

        var restaurant = cart.Restaurant!;
        var deliveryFee = restaurant.DeliveryFee;

        // 4. Calculate Coupon Discount if applicable
        decimal discount = 0m;
        int? couponId = null;

        if (!string.IsNullOrWhiteSpace(dto.CouponCode))
        {
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code.ToUpper() == dto.CouponCode.Trim().ToUpper() && c.IsActive);

            if (coupon != null &&
                coupon.StartDate <= DateTime.UtcNow &&
                coupon.EndDate >= DateTime.UtcNow &&
                subtotal >= coupon.MinimumOrderAmount &&
                coupon.TimesUsed < coupon.UsageLimit)
            {
                if (coupon.DiscountType.Equals("Percentage", StringComparison.OrdinalIgnoreCase))
                {
                    discount = (subtotal * coupon.DiscountValue) / 100m;
                    if (coupon.MaximumDiscount > 0 && discount > coupon.MaximumDiscount)
                    {
                        discount = coupon.MaximumDiscount;
                    }
                }
                else
                {
                    discount = coupon.DiscountValue;
                }

                if (discount > subtotal) discount = subtotal;

                couponId = coupon.Id;
                coupon.TimesUsed++;

                _context.CouponUsages.Add(new CouponUsage
                {
                    CouponId = coupon.Id,
                    UserId = userId,
                    UsedAt = DateTime.UtcNow
                });
            }
        }

        // 5. Calculate Tax & GrandTotal
        decimal tax = Math.Round((subtotal - discount) * 0.05m, 2); // 5% GST
        decimal grandTotal = Math.Max(0m, (subtotal - discount) + deliveryFee + tax);

        // 6. Generate readable Order Number
        var randomNum = new Random().Next(1000, 9999);
        var orderNumber = $"QB-{DateTime.UtcNow:yyyyMMdd}-{randomNum}";

        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerId = userId,
            RestaurantId = restaurant.Id,
            AddressId = address.Id,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,
            Discount = discount,
            Tax = tax,
            GrandTotal = grandTotal,
            PaymentMethod = dto.PaymentMethod,
            PaymentStatus = dto.PaymentMethod.Equals("Online", StringComparison.OrdinalIgnoreCase) ? PaymentStatuses.Paid : PaymentStatuses.Pending,
            OrderStatus = OrderStatuses.Placed,
            SpecialInstructions = dto.SpecialInstructions,
            CouponId = couponId,
            CreatedAt = DateTime.UtcNow,
            Items = orderItems
        };

        _context.Orders.Add(order);

        // 7. Clear cart
        _context.CartItems.RemoveRange(cart.Items);
        cart.Items.Clear();
        cart.RestaurantId = null;

        await _context.SaveChangesAsync();

        return (await GetOrderByIdAsync(order.Id, userId, UserRoles.Customer))!;
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int orderId, int userId, string userRole)
    {
        var query = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Restaurant)
            .Include(o => o.DeliveryPartner)
            .Include(o => o.Address)
            .Include(o => o.Items)
            .AsQueryable();

        if (userRole == UserRoles.Customer)
        {
            query = query.Where(o => o.CustomerId == userId);
        }

        var order = await query.FirstOrDefaultAsync(o => o.Id == orderId);
        return order == null ? null : MapToDto(order);
    }

    public async Task<List<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Restaurant)
            .Include(o => o.DeliveryPartner)
            .Include(o => o.Address)
            .Include(o => o.Items)
            .Where(o => o.CustomerId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<List<OrderDto>> GetRestaurantOrdersAsync(int ownerId, int? restaurantId)
    {
        var restaurantIds = await _context.Restaurants
            .Where(r => r.OwnerId == ownerId || ownerId == 0)
            .Select(r => r.Id)
            .ToListAsync();

        if (restaurantId.HasValue)
        {
            restaurantIds = restaurantIds.Where(id => id == restaurantId.Value).ToList();
        }

        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Restaurant)
            .Include(o => o.DeliveryPartner)
            .Include(o => o.Address)
            .Include(o => o.Items)
            .Where(o => restaurantIds.Contains(o.RestaurantId))
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<bool> UpdateOrderStatusAsync(int orderId, string status, int userId, string userRole)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null) return false;

        var statusUpper = status.Trim().ToUpper();

        // Validate state transition according to role permissions
        order.OrderStatus = statusUpper;
        order.UpdatedAt = DateTime.UtcNow;

        if (statusUpper == OrderStatuses.Delivered && order.PaymentMethod == PaymentMethods.COD)
        {
            order.PaymentStatus = PaymentStatuses.Paid;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<OrderDto>> GetAvailableDeliveriesAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Restaurant)
            .Include(o => o.DeliveryPartner)
            .Include(o => o.Address)
            .Include(o => o.Items)
            .Where(o => (o.OrderStatus == OrderStatuses.Ready || o.OrderStatus == OrderStatuses.Preparing) && o.DeliveryPartnerId == null)
            .OrderBy(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<List<OrderDto>> GetDeliveryPartnerOrdersAsync(int deliveryPartnerId)
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Restaurant)
            .Include(o => o.DeliveryPartner)
            .Include(o => o.Address)
            .Include(o => o.Items)
            .Where(o => o.DeliveryPartnerId == deliveryPartnerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<bool> AcceptDeliveryAsync(int orderId, int deliveryPartnerId)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null || order.DeliveryPartnerId != null) return false;

        order.DeliveryPartnerId = deliveryPartnerId;
        order.OrderStatus = OrderStatuses.OutForDelivery;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    private static OrderDto MapToDto(Order o)
    {
        return new OrderDto
        {
            Id = o.Id,
            OrderNumber = o.OrderNumber,
            CustomerId = o.CustomerId,
            CustomerName = o.Customer?.FullName ?? "Customer",
            CustomerPhone = o.Customer?.PhoneNumber ?? "",
            RestaurantId = o.RestaurantId,
            RestaurantName = o.Restaurant?.Name ?? "Restaurant",
            DeliveryPartnerId = o.DeliveryPartnerId,
            DeliveryPartnerName = o.DeliveryPartner?.FullName,
            Address = o.Address != null ? new AddressDto
            {
                Id = o.Address.Id,
                FullName = o.Address.FullName,
                PhoneNumber = o.Address.PhoneNumber,
                HouseFlat = o.Address.HouseFlat,
                Street = o.Address.Street,
                Area = o.Address.Area,
                City = o.Address.City,
                State = o.Address.State,
                PostalCode = o.Address.PostalCode,
                Landmark = o.Address.Landmark,
                AddressType = o.Address.AddressType
            } : null!,
            Subtotal = o.Subtotal,
            DeliveryFee = o.DeliveryFee,
            Discount = o.Discount,
            Tax = o.Tax,
            GrandTotal = o.GrandTotal,
            PaymentMethod = o.PaymentMethod,
            PaymentStatus = o.PaymentStatus,
            OrderStatus = o.OrderStatus,
            SpecialInstructions = o.SpecialInstructions,
            CreatedAt = o.CreatedAt,
            Items = o.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                FoodItemId = i.FoodItemId,
                FoodName = i.FoodName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                TotalPrice = i.TotalPrice
            }).ToList()
        };
    }
}
