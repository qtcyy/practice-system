using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using practice_system.Data;
using practice_system.Exceptions;
using practice_system.Models.Users;
using practice_system.Services.Common;

namespace practice_system.Services.Users
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;
        private readonly PasswordHasher<User> _hasher;
        private readonly JwtCreateService _jwt;

        public UserService(AppDbContext db, PasswordHasher<User> hasher, JwtCreateService jwt)
        {
            _db = db;
            _hasher = hasher;
            _jwt = jwt;
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
            await _db.SaveChangesAsync(ct);

            return user;
        }
    }
}
