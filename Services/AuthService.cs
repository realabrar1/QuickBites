using FoodDelivery.API.DTOs;
using FoodDelivery.API.Helpers;
using FoodDelivery.API.Models;
using FoodDelivery.API.Repositories;

namespace FoodDelivery.API.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public AuthService(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResult<UserResponseDto>> RegisterAsync(RegisterRequestDto registerDto)
    {
        var emailClean = registerDto.Email.Trim().ToLower();

        if (await _userRepository.EmailExistsAsync(emailClean))
        {
            return new AuthResult<UserResponseDto>
            {
                Success = false,
                StatusCode = 409,
                Message = "User with this email address already exists."
            };
        }

        var userRole = UserRoles.Customer;
        if (!string.IsNullOrWhiteSpace(registerDto.Role))
        {
            if (UserRoles.IsValidRole(registerDto.Role))
            {
                userRole = registerDto.Role;
            }
            else
            {
                return new AuthResult<UserResponseDto>
                {
                    Success = false,
                    StatusCode = 400,
                    Message = $"Invalid role specified. Allowed roles are: {string.Join(", ", UserRoles.AllRoles)}"
                };
            }
        }

        var user = new User
        {
            FullName = registerDto.FullName.Trim(),
            Email = emailClean,
            PhoneNumber = registerDto.PhoneNumber.Trim(),
            PasswordHash = PasswordHelper.HashPassword(registerDto.Password),
            Role = userRole,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var userDto = MapToUserResponseDto(user);

        return new AuthResult<UserResponseDto>
        {
            Success = true,
            StatusCode = 201,
            Message = "User registered successfully.",
            Data = userDto
        };
    }

    public async Task<AuthResult<LoginResponseDto>> LoginAsync(LoginRequestDto loginDto)
    {
        var emailClean = loginDto.Email.Trim().ToLower();
        var user = await _userRepository.GetByEmailAsync(emailClean);

        if (user == null || !PasswordHelper.VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            return new AuthResult<LoginResponseDto>
            {
                Success = false,
                StatusCode = 401,
                Message = "Invalid email or password."
            };
        }

        if (!user.IsActive)
        {
            return new AuthResult<LoginResponseDto>
            {
                Success = false,
                StatusCode = 401,
                Message = "Account is inactive. Please contact support."
            };
        }

        var (token, expiresAt) = _jwtService.GenerateToken(user);
        var userDto = MapToUserResponseDto(user);

        var loginResponse = new LoginResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = userDto
        };

        return new AuthResult<LoginResponseDto>
        {
            Success = true,
            StatusCode = 200,
            Message = "Login successful.",
            Data = loginResponse
        };
    }

    private static UserResponseDto MapToUserResponseDto(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }
}
