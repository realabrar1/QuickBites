namespace FoodDelivery.API.Models;

public static class UserRoles
{
    public const string Customer = "Customer";
    public const string RestaurantOwner = "RestaurantOwner";
    public const string DeliveryPartner = "DeliveryPartner";
    public const string Admin = "Admin";

    public static readonly string[] AllRoles = new[]
    {
        Customer,
        RestaurantOwner,
        DeliveryPartner,
        Admin
    };

    public static bool IsValidRole(string role)
    {
        return AllRoles.Contains(role, StringComparer.OrdinalIgnoreCase);
    }
}
