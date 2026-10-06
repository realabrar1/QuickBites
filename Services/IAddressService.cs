using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public interface IAddressService
{
    Task<List<AddressDto>> GetUserAddressesAsync(int userId);
    Task<AddressDto?> GetAddressByIdAsync(int id, int userId);
    Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto dto);
    Task<bool> UpdateAddressAsync(int id, int userId, CreateAddressDto dto);
    Task<bool> DeleteAddressAsync(int id, int userId);
}
