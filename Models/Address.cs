namespace FoodDelivery.API.Models;

public class Address
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string HouseFlat { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Landmark { get; set; } = string.Empty;
    public string AddressType { get; set; } = "Home"; // Home, Work, Other
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
