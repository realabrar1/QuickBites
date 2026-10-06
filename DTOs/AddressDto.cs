namespace FoodDelivery.API.DTOs;

public class AddressDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string HouseFlat { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Landmark { get; set; } = string.Empty;
    public string AddressType { get; set; } = "Home";
    public bool IsDefault { get; set; }
}

public class CreateAddressDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string HouseFlat { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Landmark { get; set; } = string.Empty;
    public string AddressType { get; set; } = "Home";
    public bool IsDefault { get; set; } = false;
}
