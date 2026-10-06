using FoodDelivery.API.Data;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodDelivery.API.Services;

public class AddressService : IAddressService
{
    private readonly ApplicationDbContext _context;

    public AddressService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AddressDto>> GetUserAddressesAsync(int userId)
    {
        var addresses = await _context.Addresses
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync();

        return addresses.Select(MapToDto).ToList();
    }

    public async Task<AddressDto?> GetAddressByIdAsync(int id, int userId)
    {
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        return address == null ? null : MapToDto(address);
    }

    public async Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto dto)
    {
        if (dto.IsDefault)
        {
            await ResetDefaultAddressAsync(userId);
        }

        var address = new Address
        {
            UserId = userId,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            HouseFlat = dto.HouseFlat,
            Street = dto.Street,
            Area = dto.Area,
            City = dto.City,
            State = dto.State,
            PostalCode = dto.PostalCode,
            Landmark = dto.Landmark,
            AddressType = dto.AddressType,
            IsDefault = dto.IsDefault,
            CreatedAt = DateTime.UtcNow
        };

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync();

        return MapToDto(address);
    }

    public async Task<bool> UpdateAddressAsync(int id, int userId, CreateAddressDto dto)
    {
        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (address == null) return false;

        if (dto.IsDefault && !address.IsDefault)
        {
            await ResetDefaultAddressAsync(userId);
        }

        address.FullName = dto.FullName;
        address.PhoneNumber = dto.PhoneNumber;
        address.HouseFlat = dto.HouseFlat;
        address.Street = dto.Street;
        address.Area = dto.Area;
        address.City = dto.City;
        address.State = dto.State;
        address.PostalCode = dto.PostalCode;
        address.Landmark = dto.Landmark;
        address.AddressType = dto.AddressType;
        address.IsDefault = dto.IsDefault;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAddressAsync(int id, int userId)
    {
        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (address == null) return false;

        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task ResetDefaultAddressAsync(int userId)
    {
        var defaultAddresses = await _context.Addresses.Where(a => a.UserId == userId && a.IsDefault).ToListAsync();
        foreach (var addr in defaultAddresses)
        {
            addr.IsDefault = false;
        }
    }

    private static AddressDto MapToDto(Address a)
    {
        return new AddressDto
        {
            Id = a.Id,
            UserId = a.UserId,
            FullName = a.FullName,
            PhoneNumber = a.PhoneNumber,
            HouseFlat = a.HouseFlat,
            Street = a.Street,
            Area = a.Area,
            City = a.City,
            State = a.State,
            PostalCode = a.PostalCode,
            Landmark = a.Landmark,
            AddressType = a.AddressType,
            IsDefault = a.IsDefault
        };
    }
}
