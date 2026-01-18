using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using practice_system.Data;
using practice_system.Dtos;
using practice_system.Exceptions;
using practice_system.Models.Users;
using practice_system.Services.Common;

namespace practice_system.Services.Users
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;
        private readonly IPasswordHasher<User> _hasher;
        private readonly JwtCreateService _jwt;

        public UserService(AppDbContext db, IPasswordHasher<User> hasher, JwtCreateService jwt)
        {
            _db = db;
            _hasher = hasher;
            _jwt = jwt;
        }

        public async Task<LoginResp> Login(string Username, string Password, CancellationToken ct)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == Username, ct);
            if (user == null)
            {
                throw new BusinessException("Invalid username or password");
            }
            var valid = _hasher.VerifyHashedPassword(user, user.PasswordHash, Password);
            if (valid == PasswordVerificationResult.Failed)
            {
                throw new BusinessException("Invalid username or password");
            }
            var roleName = await _db.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Join(_db.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.RoleName)
                .FirstOrDefaultAsync(ct);

            var token = _jwt.CreateToken(user.Id, user.Username, roleName ?? "USER");

            return new LoginResp(user.Id.ToString(), token);
        }

        public async Task<User> Register(string Username, string Password, CancellationToken ct)
        {
            var exist = await _db.Users.AnyAsync(u => u.Username == Username, ct);
            if (exist)
            {
                throw new BusinessException("User with this username already exists");
            }

            var user = new User
            {
                Username = Username,
            };
            var passwordHash = _hasher.HashPassword(user, Password);
            user.PasswordHash = passwordHash;

            await _db.Users.AddAsync(user, ct);

            var role = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "USER", ct);
            if (role == null)
                throw new Exception("Default role USER not found in database");
            var userRole = new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            };
            await _db.UserRoles.AddAsync(userRole, ct);

            await _db.SaveChangesAsync(ct);

            return user;
        }
    }
}
