using System.ComponentModel.DataAnnotations;

namespace FoodDelivery.API.DTOs;

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Full Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Full Name must be between 2 and 100 characters.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email address is required.")]
    [EmailAddress(ErrorMessage = "Invalid Email address format.")]
    [StringLength(100, ErrorMessage = "Email address cannot exceed 100 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone Number is required.")]
    [Phone(ErrorMessage = "Invalid Phone Number format.")]
    [StringLength(20, ErrorMessage = "Phone Number cannot exceed 20 characters.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; } = string.Empty;

    public string? Role { get; set; }
}
