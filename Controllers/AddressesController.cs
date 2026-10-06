using System.Security.Claims;
using FoodDelivery.API.DTOs;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _addressService;

    public AddressesController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAddresses()
    {
        var userId = GetUserId();
        var addresses = await _addressService.GetUserAddressesAsync(userId);
        return Ok(ApiResponse<List<AddressDto>>.SuccessResponse(addresses));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        var address = await _addressService.GetAddressByIdAsync(id, userId);
        if (address == null)
            return NotFound(ApiResponse<object>.FailureResponse("Address not found."));

        return Ok(ApiResponse<AddressDto>.SuccessResponse(address));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAddressDto dto)
    {
        var userId = GetUserId();
        var address = await _addressService.CreateAddressAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = address.Id }, ApiResponse<AddressDto>.SuccessResponse(address, "Address created successfully."));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateAddressDto dto)
    {
        var userId = GetUserId();
        var updated = await _addressService.UpdateAddressAsync(id, userId, dto);
        if (!updated)
            return NotFound(ApiResponse<object>.FailureResponse("Address not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Address updated successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        var deleted = await _addressService.DeleteAddressAsync(id, userId);
        if (!deleted)
            return NotFound(ApiResponse<object>.FailureResponse("Address not found."));

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Address deleted successfully."));
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }
}
