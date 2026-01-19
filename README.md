# Practice System

ASP.NET Core 8 Web API 练习系统，提供题目管理和答题功能。

## 技术栈

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT 认证
- Swagger/OpenAPI

## 功能特性

- **用户认证** - 注册、登录、JWT Token 认证
- **题目集管理** - 创建和管理题目集
- **题目管理** - 支持单选、多选、判断、简答题型
- **答题记录** - 追踪答题状态和结果
- **错题回顾** - 查看错误记录

## 项目结构

```
practice-system/
├── Controllers/     # API 端点
├── Models/          # 领域实体
├── Services/        # 业务逻辑
├── Data/            # 数据库上下文
├── Dtos/            # 数据传输对象
├── Exceptions/      # 自定义异常
├── Middlewares/     # 中间件
└── Migrations/      # 数据库迁移
```

## API 接口

### 用户接口 `/api/user`

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | `/register` | 用户注册 | 否 |
| POST | `/login` | 用户登录 | 否 |
| GET | `/ping` | 健康检查 | ADMIN |

### 题目接口 `/api/problem`

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/get-set` | 获取题目集列表 | 是 |
| GET | `/get-problems/{id}` | 获取题目列表 | 是 |
| GET | `/get-detail/{id}` | 获取题目详情 | 是 |
| GET | `/get-incorrect/{id}` | 获取错题列表 | 是 |
| POST | `/new-problem-set` | 创建题目集 | 是 |
| POST | `/add-problem` | 添加题目 | 是 |

## 快速开始

### 环境要求

- .NET 8 SDK
- MySQL 8.0+
- Visual Studio 2022 (可选)

### 配置数据库

在 `appsettings.json` 中配置连接字符串：

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=practice_system;User=root;Password=your_password;"
  }
}
```

### 运行项目

```bash
# 还原依赖
dotnet restore

# 应用数据库迁移
dotnet ef database update

# 运行项目
dotnet run --project practice-system
```

### 访问地址

- HTTPS: `https://localhost:7290`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:7290/swagger` (仅开发环境)

## 配置说明

### JWT 配置

在 `appsettings.json` 中配置 JWT 参数：

```json
{
  "Jwt": {
    "Issuer": "practice-system",
    "Audience": "practice-system-client",
    "SecretKey": "your-secret-key-at-least-32-characters"
  }
}
```

## 特性说明

### BaseModel 审计字段

所有领域模型继承自 `BaseModel`，提供以下字段：

| 字段 | 类型 | 描述 |
|------|------|------|
| Id | Guid | 主键 |
| CreateAt | DateTime | 创建时间 |
| UpdateAt | DateTime | 更新时间 |
| CreateBy | string | 创建人 |
| UpdateBy | string | 更新人 |
| Version | int | 版本号 |
| IsDeleted | bool | 软删除标记 |

### 软删除

使用 `IsDeleted` 字段实现软删除，数据不会被物理删除。

### 乐观并发控制

使用 `Version` 字段实现乐观锁，防止并发更新冲突。

### 全局异常处理

通过中间件统一处理异常，返回标准化的错误响应。

## 开发命令

```bash
# 构建项目
dotnet build

# 发布版本
dotnet build -c Release

# 添加数据库迁移
dotnet ef migrations add MigrationName

# 更新数据库
dotnet ef database update
```

## License

MIT
