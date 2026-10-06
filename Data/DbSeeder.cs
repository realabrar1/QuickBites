using FoodDelivery.API.Helpers;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 1. Seed Users if missing
        if (!await context.Users.AnyAsync(u => u.Email == "admin@quickbite.com"))
        {
            var admin = new User
            {
                FullName = "QuickBite System Admin",
                Email = "admin@quickbite.com",
                PhoneNumber = "+919876543210",
                PasswordHash = PasswordHelper.HashPassword("Admin@123"),
                Role = UserRoles.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var owner1 = new User
            {
                FullName = "Ramesh Sharma",
                Email = "ramesh@biryanihouse.com",
                PhoneNumber = "+919876543211",
                PasswordHash = PasswordHelper.HashPassword("Owner@123"),
                Role = UserRoles.RestaurantOwner,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var owner2 = new User
            {
                FullName = "Priya Sundaram",
                Email = "priya@dosadistrict.com",
                PhoneNumber = "+919876543212",
                PasswordHash = PasswordHelper.HashPassword("Owner@123"),
                Role = UserRoles.RestaurantOwner,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var owner3 = new User
            {
                FullName = "Vikram Singh",
                Email = "vikram@urbantandoor.com",
                PhoneNumber = "+919876543213",
                PasswordHash = PasswordHelper.HashPassword("Owner@123"),
                Role = UserRoles.RestaurantOwner,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var customer1 = new User
            {
                FullName = "Ananya Rao",
                Email = "customer@quickbite.com",
                PhoneNumber = "+919876543214",
                PasswordHash = PasswordHelper.HashPassword("Customer@123"),
                Role = UserRoles.Customer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var delivery1 = new User
            {
                FullName = "Suresh Kumar",
                Email = "delivery@quickbite.com",
                PhoneNumber = "+919876543215",
                PasswordHash = PasswordHelper.HashPassword("Delivery@123"),
                Role = UserRoles.DeliveryPartner,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(admin, owner1, owner2, owner3, customer1, delivery1);
            await context.SaveChangesAsync();
        }

        // 2. Seed Restaurants if missing
        if (!await context.Restaurants.AnyAsync())
        {
            var owner1 = await context.Users.FirstAsync(u => u.Role == UserRoles.RestaurantOwner);

            var rest1 = new Restaurant
            {
                Name = "Bangalore Biryani House",
                Description = "Authentic Hyderabadi & Ambur dum biryanis, kebabs, and Mughlai delicacies.",
                LogoUrl = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
                CoverImageUrl = "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80",
                CuisineType = "Biryani, Mughlai, North Indian",
                Address = "120 Indiranagar 100ft Road, Bangalore",
                Phone = "+919876543211",
                Email = "ramesh@biryanihouse.com",
                OpeningTime = "11:00 AM",
                ClosingTime = "11:00 PM",
                DeliveryFee = 35.00m,
                MinimumOrderAmount = 150.00m,
                Rating = 4.8,
                TotalRatings = 340,
                IsActive = true,
                OwnerId = owner1.Id,
                CreatedAt = DateTime.UtcNow
            };

            var rest2 = new Restaurant
            {
                Name = "Dosa District",
                Description = "Crispy South Indian dosas, idlis, vadas, and authentic Filter Coffee.",
                LogoUrl = "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80",
                CoverImageUrl = "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&q=80",
                CuisineType = "South Indian, Street Food",
                Address = "45 Koramangala 5th Block, Bangalore",
                Phone = "+919876543212",
                Email = "priya@dosadistrict.com",
                OpeningTime = "07:00 AM",
                ClosingTime = "10:30 PM",
                DeliveryFee = 25.00m,
                MinimumOrderAmount = 100.00m,
                Rating = 4.7,
                TotalRatings = 512,
                IsActive = true,
                OwnerId = owner1.Id,
                CreatedAt = DateTime.UtcNow
            };

            var rest3 = new Restaurant
            {
                Name = "Urban Tandoor",
                Description = "Rich Butter Chicken, Dal Makhani, Paneer Tikka, and fresh garlic naans.",
                LogoUrl = "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80",
                CoverImageUrl = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80",
                CuisineType = "North Indian, Tandoori",
                Address = "88 MG Road, Bangalore",
                Phone = "+919876543213",
                Email = "vikram@urbantandoor.com",
                OpeningTime = "12:00 PM",
                ClosingTime = "11:30 PM",
                DeliveryFee = 40.00m,
                MinimumOrderAmount = 200.00m,
                Rating = 4.6,
                TotalRatings = 289,
                IsActive = true,
                OwnerId = owner1.Id,
                CreatedAt = DateTime.UtcNow
            };

            context.Restaurants.AddRange(rest1, rest2, rest3);
            await context.SaveChangesAsync();

            // Seed Categories & Food Items
            var catBiryani = new FoodCategory { Name = "Special Biryanis", Description = "Signature dum biryanis", DisplayOrder = 1, RestaurantId = rest1.Id };
            var catStarters = new FoodCategory { Name = "Kebabs & Starters", Description = "Grilled appetizers", DisplayOrder = 2, RestaurantId = rest1.Id };
            context.FoodCategories.AddRange(catBiryani, catStarters);
            await context.SaveChangesAsync();

            context.FoodItems.AddRange(
                new FoodItem
                {
                    Name = "Chicken Dum Biryani",
                    Description = "Marinated chicken cooked with long grain basmati rice and aromatic spices.",
                    Price = 280.00m,
                    DiscountPrice = 249.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
                    IsVegetarian = false,
                    IsAvailable = true,
                    PreparationTimeMinutes = 25,
                    CategoryId = catBiryani.Id,
                    RestaurantId = rest1.Id
                },
                new FoodItem
                {
                    Name = "Paneer Tikka Biryani",
                    Description = "Char-grilled paneer cubes layered with saffron spiced rice.",
                    Price = 240.00m,
                    DiscountPrice = 210.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&q=80",
                    IsVegetarian = true,
                    IsAvailable = true,
                    PreparationTimeMinutes = 20,
                    CategoryId = catBiryani.Id,
                    RestaurantId = rest1.Id
                },
                new FoodItem
                {
                    Name = "Chicken 65",
                    Description = "Spicy deep-fried chicken bites tossed with curry leaves.",
                    Price = 220.00m,
                    DiscountPrice = null,
                    ImageUrl = "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&q=80",
                    IsVegetarian = false,
                    IsAvailable = true,
                    PreparationTimeMinutes = 15,
                    CategoryId = catStarters.Id,
                    RestaurantId = rest1.Id
                }
            );

            // Seed Dosa District Category & Items
            var catDosa = new FoodCategory { Name = "Crispy Dosas", Description = "Golden dosas with sambar & chutneys", DisplayOrder = 1, RestaurantId = rest2.Id };
            context.FoodCategories.Add(catDosa);
            await context.SaveChangesAsync();

            context.FoodItems.AddRange(
                new FoodItem
                {
                    Name = "Mysore Masala Dosa",
                    Description = "Crispy dosa spread with spicy red garlic chutney and spiced potato masala.",
                    Price = 130.00m,
                    DiscountPrice = 115.00m,
                    ImageUrl = "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80",
                    IsVegetarian = true,
                    IsAvailable = true,
                    PreparationTimeMinutes = 15,
                    CategoryId = catDosa.Id,
                    RestaurantId = rest2.Id
                }
            );

            await context.SaveChangesAsync();
        }

        // 3. Seed Coupons if missing
        if (!await context.Coupons.AnyAsync())
        {
            context.Coupons.AddRange(
                new Coupon
                {
                    Code = "QUICK50",
                    Description = "50% OFF up to ₹100 on orders above ₹200",
                    DiscountType = "Percentage",
                    DiscountValue = 50.00m,
                    MinimumOrderAmount = 200.00m,
                    MaximumDiscount = 100.00m,
                    StartDate = DateTime.UtcNow.AddDays(-5),
                    EndDate = DateTime.UtcNow.AddMonths(2),
                    UsageLimit = 500,
                    IsActive = true
                },
                new Coupon
                {
                    Code = "WELCOME100",
                    Description = "Flat ₹100 OFF on your first order above ₹300",
                    DiscountType = "Fixed",
                    DiscountValue = 100.00m,
                    MinimumOrderAmount = 300.00m,
                    MaximumDiscount = 100.00m,
                    StartDate = DateTime.UtcNow.AddDays(-5),
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    UsageLimit = 1000,
                    IsActive = true
                }
            );
            await context.SaveChangesAsync();
        }
    }
}
