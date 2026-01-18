using practice_system.Models.Users;

namespace practice_system.Services.Users
{
    public interface IUserService
    {
        Task<User> Register(string Username, string Password, CancellationToken ct);
    }
}
