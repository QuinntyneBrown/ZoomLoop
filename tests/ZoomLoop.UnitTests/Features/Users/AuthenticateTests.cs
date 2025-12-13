// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using System.Security.Cryptography;
using ZoomLoop.Api.Features.Users;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.UnitTests.Features.Users;

[TestFixture]
public class AuthenticateTests
{
    private InMemoryZoomLoopContext _context = default!;
    private IPasswordHasher _passwordHasher = default!;
    private ITokenBuilder _tokenBuilder = default!;

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
                ["Authentication:ExpirationMinutes"] = "60"
            })
            .Build();

        _tokenBuilder = new TokenBuilder(new TokenProvider(configuration));
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
        var salt = RandomNumberGenerator.GetBytes(16);
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(salt, password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Password = hashedPassword,
            Salt = salt,
            IsDeleted = false,
            Roles = new List<Role>()
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new AuthenticateHandler(_context, _passwordHasher, _tokenBuilder);
        var request = new AuthenticateRequest("testuser", password);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.AccessToken, Is.Not.Null.And.Not.Empty);
        Assert.That(result.UserId, Is.EqualTo(user.UserId));
    }

    [Test]
    public async Task ShouldReturnNullForInvalidUsername()
    {
        // Arrange
        var handler = new AuthenticateHandler(_context, _passwordHasher, _tokenBuilder);
        var request = new AuthenticateRequest("nonexistent", "password");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldReturnNullForInvalidPassword()
    {
        // Arrange
        var salt = RandomNumberGenerator.GetBytes(16);
        var password = "CorrectPassword";
        var hashedPassword = _passwordHasher.HashPassword(salt, password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "testuser",
            Password = hashedPassword,
            Salt = salt,
            IsDeleted = false,
            Roles = new List<Role>()
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new AuthenticateHandler(_context, _passwordHasher, _tokenBuilder);
        var request = new AuthenticateRequest("testuser", "WrongPassword");

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldNotAuthenticateDeletedUser()
    {
        // Arrange
        var salt = RandomNumberGenerator.GetBytes(16);
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(salt, password);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "deleteduser",
            Password = hashedPassword,
            Salt = salt,
            IsDeleted = true,
            Roles = new List<Role>()
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new AuthenticateHandler(_context, _passwordHasher, _tokenBuilder);
        var request = new AuthenticateRequest("deleteduser", password);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task ShouldIncludeUserIdInToken()
    {
        // Arrange
        var salt = RandomNumberGenerator.GetBytes(16);
        var password = "TestPassword123";
        var hashedPassword = _passwordHasher.HashPassword(salt, password);

        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Username = "testuser",
            Password = hashedPassword,
            Salt = salt,
            IsDeleted = false,
            Roles = new List<Role>()
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new AuthenticateHandler(_context, _passwordHasher, _tokenBuilder);
        var request = new AuthenticateRequest("testuser", password);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.UserId, Is.EqualTo(userId));
    }
}
