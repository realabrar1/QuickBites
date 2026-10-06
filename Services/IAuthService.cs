using FoodDelivery.API.DTOs;

namespace FoodDelivery.API.Services;

public class AuthResult<T>
{
    public bool Success { get; set; }
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
}

public interface IAuthService
{
    Task<AuthResult<UserResponseDto>> RegisterAsync(RegisterRequestDto registerDto);
    Task<AuthResult<LoginResponseDto>> LoginAsync(LoginRequestDto loginDto);
}
