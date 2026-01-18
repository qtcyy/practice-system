using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using practice_system.Dtos;
using practice_system.Services.Users;

namespace practice_system.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _user;

        public UserController(IUserService user)
        {
            _user = user;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterReq req, CancellationToken ct)
        {
            // Registration logic here
            var username = req.Username.Trim();
            if (string.IsNullOrEmpty(username) || req.Password.Length < 6)
            {
                return BadRequest("Username and password cannot be empty.");
            }
            var user = await _user.Register(username, req.Password, ct);

            return Ok(new RegisterResp("User registered successfully.", user.Id, user.Username));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginReq req, CancellationToken ct)
        {
            // Login logic here
            var username = req.Username.Trim();
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(req.Password))
            {
                return BadRequest("Username and password cannot be empty.");
            }
            var resp = await _user.Login(username, req.Password, ct);

            return Ok(resp);
        }

        [HttpGet("ping")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }
    }
}
