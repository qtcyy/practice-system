using Microsoft.AspNetCore.Mvc;
using practice_system.Dtos;

namespace practice_system.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterReq req)
        {
            // Registration logic here
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginReq req)
        {
            // Login logic here
            return Ok("User logged in successfully.");
        }
    }
}
