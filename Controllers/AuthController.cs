using FoodDelivery.API.DTOs;
using FoodDelivery.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Register a new user account.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<UserResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(ApiResponse<object>.FailureResponse("Validation failed.", errors));
        }

        var result = await _authService.RegisterAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, ApiResponse<object>.FailureResponse(result.Message));
        }

        return StatusCode(StatusCodes.Status201Created, ApiResponse<UserResponseDto>.SuccessResponse(result.Data!, result.Message));
    }

    /// <summary>
    /// Authenticate user and receive JWT token.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(ApiResponse<object>.FailureResponse("Validation failed.", errors));
        }

        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, ApiResponse<object>.FailureResponse(result.Message));
        }

        return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(result.Data!, result.Message));
    }
}
