namespace practice_system.Dtos;

public record ErrorResponse(int Code, string Message, object? Details = null);
