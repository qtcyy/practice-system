using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using practice_system.Models;
using practice_system.Models.Users;

namespace practice_system.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet properties will be added here as models are created

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User 表 Username 唯一索引
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        modelBuilder.Entity<Role>()
            .HasIndex(r => r.RoleName);
        modelBuilder.Entity<UserRole>()
            .HasIndex(ur => new { ur.UserId, ur.RoleId })
            .IsUnique();

        // 获取所有继承 BaseModel 的实体类型
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseModel).IsAssignableFrom(entityType.ClrType))
            {
                // 配置 Version 为并发令牌（乐观锁）
                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(BaseModel.Version))
                    .IsConcurrencyToken();

                // 配置软删除全局过滤器
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(BaseModel.IsDeleted));
                var falseConstant = Expression.Constant(false);
                var condition = Expression.Equal(property, falseConstant);
                var lambda = Expression.Lambda(condition, parameter);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        ProcessBaseModelEntities();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        ProcessBaseModelEntities();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private void ProcessBaseModelEntities()
    {
        var entries = ChangeTracker.Entries<BaseModel>();
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    if (entry.Entity.Id == Guid.Empty)
                        entry.Entity.Id = Guid.NewGuid();
                    entry.Entity.CreateAt = now;
                    entry.Entity.UpdateAt = now;
                    entry.Entity.Version = 1;
                    entry.Entity.IsDeleted = false;
                    break;

                case EntityState.Modified:
                    entry.Entity.UpdateAt = now;
                    entry.Entity.Version++;
                    // 防止修改 CreateAt
                    entry.Property(nameof(BaseModel.CreateAt)).IsModified = false;
                    break;

                case EntityState.Deleted:
                    // 软删除：转为修改状态
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.UpdateAt = now;
                    entry.Entity.Version++;
                    break;
            }
        }
    }
}
