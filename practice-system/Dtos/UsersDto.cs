namespace practice_system.Dtos
{
    // DTO for user registration
    public record RegisterReq(string Username, string Password);
    public record RegisterResp(Guid UserId, string Username);

    // DTO for user login
    public record LoginReq(string Username, string Password);
    public record LoginResp(string UserId, string Token);
}
