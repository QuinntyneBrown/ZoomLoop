// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using ZoomLoop.Api.Features.Auth;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.UnitTests.Features.Users;

[TestFixture]
public class AuthenticateTests
{
    private InMemoryZoomLoopContext _context = default!;
    private IPasswordHasher _passwordHasher = default!;
    private ITokenBuilder _tokenBuilder = default!;
    private ITokenProvider _tokenProvider = default!;
    private Mock<IHttpContextAccessor> _httpContextAccessor = default!;
    private Mock<ILogger<LoginHandler>> _logger = default!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<InMemoryZoomLoopContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new InMemoryZoomLoopContext(options);
        _passwordHasher = new PasswordHasher();

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Authentication:JwtKey"] = "0123456789ABCDEF0123456789ABCDEF",
                ["Authentication:JwtIssuer"] = "ZoomLoop",
                ["Authentication:JwtAudience"] = "ZoomLoop",
                ["Authentication:ExpirationMinutes"] = "60",
            })
            .Build();

        _tokenProvider = new TokenProvider(configuration);
        _tokenBuilder = new TokenBuilder(_tokenProvider);
        _httpContextAccessor = new Mock<IHttpContextAccessor>();
        _logger = new Mock<ILogger<LoginHandler>>();

        // Setup default HTTP context
        var mockHttpContext = new DefaultHttpContext();
        mockHttpContext.Connection.RemoteIpAddress = System.Net.IPAddress.Parse("127.0.0.1");
        mockHttpContext.Request.Headers.UserAgent = "Test User Agent";
        _httpContextAccessor.Setup(x => x.HttpContext).Returns(mockHttpContext);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task ShouldAuthenticateValidUser()
    {
        // Arrange
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Email = "testuser@example.com",
            PasswordHash = hashedPassword,
            FirstName = "Test",
            LastName = "User",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role>(),
            Sessions = new List<Session>(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new LoginHandler(_context, _passwordHasher, _tokenBuilder, _tokenProvider, _httpContextAccessor.Object, _logger.Object);
        var request = new LoginRequest(user.Email, password, false);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.AccessToken, Is.Not.Null.And.Not.Empty);
        Assert.That(result.User.UserId, Is.EqualTo(user.UserId));
    }

    [Test]
    public async Task ShouldReturnNullForInvalidEmail()
    {
        // Arrange
        var handler = new LoginHandler(_context, _passwordHasher, _tokenBuilder, _tokenProvider, _httpContextAccessor.Object, _logger.Object);
        var request = new LoginRequest("nonexistent@example.com", "password", false);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldReturnNullForInvalidPassword()
    {
        // Arrange
        var password = "CorrectPassword";
        var hashedPassword = _passwordHasher.HashPassword(password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Email = "testuser@example.com",
            PasswordHash = hashedPassword,
            FirstName = "Test",
            LastName = "User",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role>(),
            Sessions = new List<Session>(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new LoginHandler(_context, _passwordHasher, _tokenBuilder, _tokenProvider, _httpContextAccessor.Object, _logger.Object);
        var request = new LoginRequest(user.Email, "WrongPassword", false);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldNotAuthenticateInactiveUser()
    {
        // Arrange
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Email = "inactive@example.com",
            PasswordHash = hashedPassword,
            FirstName = "Inactive",
            LastName = "User",
            Status = UserStatus.Suspended,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role>(),
            Sessions = new List<Session>(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new LoginHandler(_context, _passwordHasher, _tokenBuilder, _tokenProvider, _httpContextAccessor.Object, _logger.Object);
        var request = new LoginRequest(user.Email, password, false);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldIncludeUserIdInResponse()
    {
        // Arrange
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(password);

        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Email = "testuser@example.com",
            PasswordHash = hashedPassword,
            FirstName = "Test",
            LastName = "User",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role>(),
            Sessions = new List<Session>(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new LoginHandler(_context, _passwordHasher, _tokenBuilder, _tokenProvider, _httpContextAccessor.Object, _logger.Object);
        var request = new LoginRequest(user.Email, password, false);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.User.UserId, Is.EqualTo(userId));
    }

    [Test]
    public async Task ShouldIncludeRolesInResponse()
    {
        // Arrange
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(password);

        var adminRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Admin",
            Users = new List<User>(),
            Privileges = new List<Privilege>()
        };

        var userRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "User",
            Users = new List<User>(),
            Privileges = new List<Privilege>()
        };

        _context.Roles.AddRange(adminRole, userRole);

        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Email = "admin@example.com",
            PasswordHash = hashedPassword,
            FirstName = "Admin",
            LastName = "User",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role> { adminRole, userRole },
            Sessions = new List<Session>(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new LoginHandler(_context, _passwordHasher, _tokenBuilder, _tokenProvider, _httpContextAccessor.Object, _logger.Object);
        var request = new LoginRequest(user.Email, password, false);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.User.Roles, Is.Not.Null);
        Assert.That(result.User.Roles.Count, Is.EqualTo(2));
        Assert.That(result.User.Roles.Any(r => r.Name == "Admin"), Is.True);
        Assert.That(result.User.Roles.Any(r => r.Name == "User"), Is.True);
    }

    [Test]
    public async Task ShouldReturnEmptyRolesWhenUserHasNoRoles()
    {
        // Arrange
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(password);

        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Email = "noroles@example.com",
            PasswordHash = hashedPassword,
            FirstName = "No",
            LastName = "Roles",
            Status = UserStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Roles = new List<Role>(),
            Sessions = new List<Session>(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new LoginHandler(_context, _passwordHasher, _tokenBuilder, _tokenProvider, _httpContextAccessor.Object, _logger.Object);
        var request = new LoginRequest(user.Email, password, false);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.User.Roles, Is.Not.Null);
        Assert.That(result.User.Roles.Count, Is.EqualTo(0));
    }
}
