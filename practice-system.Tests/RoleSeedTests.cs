using Microsoft.EntityFrameworkCore;
using practice_system.Data;
using practice_system.Models.Users;

namespace practice_system.Tests;

public class RoleSeedTests
{
    private const string ConnectionString = "Server=localhost;Database=practice_system;User=root;Password=123456;";

    private AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseMySql(ConnectionString, ServerVersion.AutoDetect(ConnectionString))
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task SeedRoles_AddAdminAndUserRoles()
    {
        using var db = CreateDbContext();

        // Check if roles already exist
        var existingRoles = await db.Roles
            .IgnoreQueryFilters()
            .Select(r => r.RoleName)
            .ToListAsync();

        // Add ADMIN role if not exists
        if (!existingRoles.Contains("ADMIN"))
        {
            var adminRole = new Role { RoleName = "ADMIN" };
            await db.Roles.AddAsync(adminRole);
        }

        // Add USER role if not exists
        if (!existingRoles.Contains("USER"))
        {
            var userRole = new Role { RoleName = "USER" };
            await db.Roles.AddAsync(userRole);
        }

        await db.SaveChangesAsync();

        // Verify roles exist
        var roles = await db.Roles
            .IgnoreQueryFilters()
            .Select(r => r.RoleName)
            .ToListAsync();

        Assert.Contains("ADMIN", roles);
        Assert.Contains("USER", roles);
    }
}
