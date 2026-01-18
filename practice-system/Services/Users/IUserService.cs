using practice_system.Dtos;
using practice_system.Models.Users;

namespace practice_system.Services.Users
{
    public interface IUserService
    {
        Task<User> Register(string Username, string Password, CancellationToken ct);

        Task<LoginResp> Login(string Username, string Password, CancellationToken ct);
    }
}
