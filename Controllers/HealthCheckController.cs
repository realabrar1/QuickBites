using FoodDelivery.API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthCheckController : ControllerBase
{
    [HttpGet]
    public IActionResult GetStatus()
    {
        var status = new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Service = "FoodDelivery.API"
        };

        return Ok(ApiResponse<object>.SuccessResponse(status, "API is online and operational."));
    }
}
