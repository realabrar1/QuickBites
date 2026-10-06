using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Restaurant> Restaurants => Set<Restaurant>();
    public DbSet<FoodCategory> FoodCategories => Set<FoodCategory>();
    public DbSet<FoodItem> FoodItems => Set<FoodItem>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<CouponUsage> CouponUsages => Set<CouponUsage>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(30);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");
        });

        // Restaurant
        modelBuilder.Entity<Restaurant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
            entity.Property(e => e.CuisineType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DeliveryFee).HasPrecision(10, 2);
            entity.Property(e => e.MinimumOrderAmount).HasPrecision(10, 2);

            entity.HasOne(r => r.Owner)
                  .WithMany()
                  .HasForeignKey(r => r.OwnerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // FoodCategory
        modelBuilder.Entity<FoodCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);

            entity.HasOne(c => c.Restaurant)
                  .WithMany(r => r.Categories)
                  .HasForeignKey(c => c.RestaurantId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // FoodItem
        modelBuilder.Entity<FoodItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.DiscountPrice).HasPrecision(10, 2);

            entity.HasOne(f => f.Category)
                  .WithMany(c => c.FoodItems)
                  .HasForeignKey(f => f.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(f => f.Restaurant)
                  .WithMany(r => r.FoodItems)
                  .HasForeignKey(f => f.RestaurantId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Address
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Street).IsRequired().HasMaxLength(200);
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);

            entity.HasOne(a => a.User)
                  .WithMany()
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Cart & CartItem
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();

            entity.HasOne(c => c.User)
                  .WithOne()
                  .HasForeignKey<Cart>(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Restaurant)
                  .WithMany()
                  .HasForeignKey(c => c.RestaurantId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UnitPrice).HasPrecision(10, 2);

            entity.HasOne(ci => ci.Cart)
                  .WithMany(c => c.Items)
                  .HasForeignKey(ci => ci.CartId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ci => ci.FoodItem)
                  .WithMany()
                  .HasForeignKey(ci => ci.FoodItemId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Order & OrderItem
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.OrderNumber).IsUnique();

            entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Subtotal).HasPrecision(10, 2);
            entity.Property(e => e.DeliveryFee).HasPrecision(10, 2);
            entity.Property(e => e.Discount).HasPrecision(10, 2);
            entity.Property(e => e.Tax).HasPrecision(10, 2);
            entity.Property(e => e.GrandTotal).HasPrecision(10, 2);

            entity.HasOne(o => o.Customer)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(o => o.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(o => o.Restaurant)
                  .WithMany(r => r.Orders)
                  .HasForeignKey(o => o.RestaurantId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(o => o.DeliveryPartner)
                  .WithMany()
                  .HasForeignKey(o => o.DeliveryPartnerId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(o => o.Address)
                  .WithMany()
                  .HasForeignKey(o => o.AddressId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UnitPrice).HasPrecision(10, 2);
            entity.Property(e => e.TotalPrice).HasPrecision(10, 2);

            entity.HasOne(oi => oi.Order)
                  .WithMany(o => o.Items)
                  .HasForeignKey(oi => oi.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Coupon
        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.DiscountValue).HasPrecision(10, 2);
            entity.Property(e => e.MinimumOrderAmount).HasPrecision(10, 2);
            entity.Property(e => e.MaximumDiscount).HasPrecision(10, 2);
        });

        modelBuilder.Entity<CouponUsage>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(cu => cu.Coupon)
                  .WithMany()
                  .HasForeignKey(cu => cu.CouponId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Review
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(r => r.Customer)
                  .WithMany()
                  .HasForeignKey(r => r.CustomerId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Restaurant)
                  .WithMany()
                  .HasForeignKey(r => r.RestaurantId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
