using System.Text.Json;
using practice_system.Dtos;
using practice_system.Exceptions;

namespace practice_system.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

        var (code, message, details) = exception switch
        {
            BusinessException biz => (biz.Code, biz.Message, (object?)null),
            UnauthorizedAccessException => (401, "未授权访问", null),
            _ => (500, "服务器内部错误", IsDevelopment(context) ? exception.Message : null)
        };

        context.Response.StatusCode = code;
        context.Response.ContentType = "application/json";

        var response = new ErrorResponse(code, message, details);
        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }

    private static bool IsDevelopment(HttpContext context)
    {
        var env = context.RequestServices.GetService<IWebHostEnvironment>();
        return env?.IsDevelopment() ?? false;
    }
}
