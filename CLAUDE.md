# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ASP.NET Core 8 Web API project using C# with Swagger/OpenAPI documentation. Visual Studio 2022 solution-based project structure.

## Build and Run Commands

```bash
# Build
dotnet build

# Run (development)
dotnet run --project practice-system

# Run with specific profile
dotnet run --project practice-system --launch-profile https
dotnet run --project practice-system --launch-profile http

# Build release
dotnet build -c Release
```

## Development URLs

- HTTPS: `https://localhost:7290`
- HTTP: `http://localhost:5000`
- Swagger UI (dev only): `https://localhost:7290/swagger`

## Architecture

**Layered Structure:**
- `Controllers/` - API endpoints with attribute routing
- `Models/` - Domain entities inheriting from `BaseModel`

**Base Model Pattern:**
All domain models should inherit from `BaseModel` which provides:
- `Id` (Guid) - Primary key
- `CreateAt`, `UpdateAt` - Audit timestamps
- `CreateBy`, `UpdateBy` - User tracking
- `Version` - Optimistic concurrency
- `IsDeleted` - Soft delete flag

**Namespace:** `practice_system` (underscores due to project naming)

## Conventions

- Constructor injection for dependencies (ILogger, services)
- Attribute routing on controllers (`[Route("[controller]")]`)
- Nullable reference types enabled
- Implicit usings enabled
