using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using UserAuthApi.Data;
using UserAuthApi.Models;
using UserAuthApi.Services;
using System.Linq;
using System.Security.Claims;

namespace UserAuthApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public AuthController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] AuthRequestDto registerDto)
        {
            if (_context.Users.Any(u => u.Username == registerDto.Username))
                return BadRequest("Username already exists");

            var user = new User
            {
                Username = registerDto.Username,
                Password = _authService.HashPassword(registerDto.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthRequestDto loginDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == loginDto.Username);
            if (user == null || user.Password != _authService.HashPassword(loginDto.Password))
                return Unauthorized("Invalid credentials");

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { token });
        }

        [Authorize] // Requires authentication
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            var userIdentity = HttpContext.User.Identity as ClaimsIdentity;
            var username = userIdentity?.FindFirst(ClaimTypes.Name)?.Value;

            return Ok(new { message = "Authenticated successfully", user = username });
        }
    }
}
